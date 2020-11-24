using AutoMapper;
using Microsoft.Extensions.Logging;
using Sortify.Contracts.Enums;
using Sortify.Contracts.Models;
using Sortify.Contracts.Requests.Commands;
using Sortify.Contracts.Responses;
using Sortify.Extensions;
using SpotifyAPI.Web;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
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

                if (command.SortByAudioFeatures)
                {
                    tracks = await GetTracksWithAudioFeatures(tracks);
                }

                var sortedTracks = SortTracks(tracks, command.SortBy);

                var playlists = SplitIntoPlaylists(sortedTracks, command);
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

        private async Task<IEnumerable<Track>> GetTracksFromAllPlaylists(IEnumerable<string> playlistIds)
        {
            var tracks = new List<Track>();

            foreach (var playlistId in playlistIds)
            {
                tracks.AddRange(await GetTracksFromPlaylist(playlistId));
            }

            var filteredTracks = tracks.GroupBy(x => x?.Id)
                                       .Select(x => x.First())
                                       .Where(x => !x.IsLocal)
                                       .ToList();

            return filteredTracks;
        }

        private async Task<IEnumerable<Track>> GetTracksFromPlaylist(string playlistId)
        {
            var index = 0;
            var playlistTracks = new List<Track>();

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
                playlistTracks.AddRange(requestedTracks.Items.Select(x => mapper.Map<Track>(x.Track)));

                index++;
            }
            while (playlistTracks.Count < playlistSize);

            return playlistTracks;
        }

        private async Task<IEnumerable<Track>> GetTracksWithAudioFeatures(IEnumerable<Track> tracks)
        {
            var index = 0;
            var audioFeaturesList = new List<TrackAudioFeatures>();

            while (audioFeaturesList.Count < tracks.Count())
            {
                var request = new TracksAudioFeaturesRequest(tracks.Skip(index * maxItemsPerRequest)
                                                                   .Take(maxItemsPerRequest)
                                                                   .Select(x => x.Id)
                                                                   .ToList());

                var requestedAudioFeatures = await spotify.Tracks.GetSeveralAudioFeatures(request);
                audioFeaturesList.AddRange(requestedAudioFeatures.AudioFeatures);

                index++;
            }

            foreach (var (track, audioFeatures) in tracks.Zip(audioFeaturesList, (track, audioFeatures) => (track, audioFeatures)))
            {
                track.AudioFeatures = mapper.Map<AudioFeatures>(audioFeatures);
            }

            return tracks;
        }

        private List<Track> SortTracks(IEnumerable<Track> tracks, IEnumerable<string> sortBy)
        {
            var sortByPhrase = string.Join(",", sortBy);
            var sortedTracks = tracks.AsQueryable()
                                     .OrderBy(sortByPhrase)
                                     .ToList();

            return sortedTracks;
        }

        private List<List<Track>> SplitIntoPlaylists(List<Track> tracks, CreatePlaylistsCommand command)
        {
            var playlists = new List<List<Track>>();
            var splitIndices = GetSplitIndices(tracks, command);

            var previousIndex = 0;

            foreach (var splitIndex in splitIndices)
            {
                playlists.Add(tracks.GetRange(previousIndex, splitIndex - previousIndex));
                previousIndex = splitIndex;
            }

            return playlists;
        }

        private List<int> GetSplitIndices(IEnumerable<Track> tracks, CreatePlaylistsCommand command)
        {
            var splitIndices = new HashSet<int>() { tracks.Count() };

            if (command.SplitByTracksNumber.HasValue)
            {
                splitIndices = tracks.GetSplitIndicesByTracks(command.SplitByTracksNumber.GetValueOrDefault());
            }

            if (command.SplitByPlaylistsNumber.HasValue)
            {
                splitIndices = tracks.GetSplitIndicesByPlaylists(command.SplitByPlaylistsNumber.GetValueOrDefault());
            } 

            return splitIndices.ToList();
        }
    }
}
