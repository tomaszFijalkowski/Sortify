using AutoMapper;
using Microsoft.Extensions.Logging;
using Sortify.Contracts.Requests.Commands;
using Sortify.Contracts.Responses;
using SpotifyAPI.Web;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Sortify.Handlers.QueryHandlers
{
    public class CreatePlaylistsCommandHandler : ICommandHandler<CreatePlaylistsCommand>
    {
        private const int maxItemsPerRequest = 100;
        private readonly ILogger<CreatePlaylistsCommandHandler> logger;
        private readonly IMapper mapper;
        private SpotifyClient spotify;

        public CreatePlaylistsCommandHandler(ILogger<CreatePlaylistsCommandHandler> logger, IMapper mapper)
        {
            this.logger = logger;
            this.mapper = mapper;
        }

        public async Task<OperationResult> HandleAsync(CreatePlaylistsCommand command)
        {
            OperationResult result;

            try
            {
                if (HasNoRequiredParameters(command))
                {
                    result = OperationResult.Failure("One or more parameters are missing in the request.");
                    return await Task.FromResult(result);
                }

                var config = SpotifyClientConfig
                  .CreateDefault(command.AccessToken)
                  .WithRetryHandler(new SimpleRetryHandler() { RetryTimes = 3, RetryAfter = TimeSpan.FromMilliseconds(500) });

                spotify = new SpotifyClient(config);

                var tracks = await GetTracksFromAllPlaylists(command.PlaylistIds);

                result = OperationResult.Success();
                return await Task.FromResult(result);
            } 
            catch (Exception ex)
            {
                logger.LogError(ex, "An unexpected error occurred.");
                result = OperationResult.Failure("Something went wrong, please try again later.");
                return await Task.FromResult(result);
            }
        }

        private bool HasNoRequiredParameters(CreatePlaylistsCommand command)
        {
            return command.AccessToken == null || command.PlaylistIds?.Count == 0 || command.SortBy?.Count == 0 || command.Name == null;
        }

        private async Task<List<PlaylistTrack<IPlayableItem>>> GetTracksFromAllPlaylists(IEnumerable<string> playlistIds)
        {
            var tracks = new List<PlaylistTrack<IPlayableItem>>();

            foreach (var playlistId in playlistIds)
            {
                tracks.AddRange(await GetTracksFromPlaylist(playlistId));
            }

            var distinctTracks = tracks.GroupBy(x => ((FullTrack)x.Track).Id)
                                       .Select(x => x.First())
                                       .ToList();

            return distinctTracks;
        }

        private async Task<List<PlaylistTrack<IPlayableItem>>> GetTracksFromPlaylist(string playlistId)
        {
            var index = 0;
            var playlistTracks = new List<PlaylistTrack<IPlayableItem>>();

            int playlistSize;
            do
            {
                var request = new PlaylistGetItemsRequest
                {
                    Limit = maxItemsPerRequest,
                    Offset = index * maxItemsPerRequest
                };

                var requestedTracks = await spotify.Playlists.GetItems(playlistId, request);
                playlistSize = requestedTracks.Total.GetValueOrDefault();
                playlistTracks.AddRange(requestedTracks.Items);

                index++;
            }
            while (playlistTracks.Count < playlistSize);

            return playlistTracks;
        }
    }
}
