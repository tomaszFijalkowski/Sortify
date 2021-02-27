using AutoMapper;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using Sortify.Contracts.Models;
using Sortify.Contracts.Requests.Commands;
using Sortify.Contracts.Responses;
using Sortify.Helpers;
using Sortify.Hubs;
using SpotifyAPI.Web;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Threading;
using System.Threading.Tasks;

namespace Sortify.Handlers.QueryHandlers
{
    public class SortPlaylistsCommandHandler : ICommandHandler<SortPlaylistsCommand>
    {
        private const int MaxItemsPerRequest = 100;

        private readonly IHubContext<ProgressHub> progressHub;
        private readonly ILogger<CreatePlaylistsCommandHandler> logger;
        private readonly IMapper mapper;

        private ProgressManager progressManager;
        private SpotifyClient spotify;

        private CancellationToken cancellationToken;
        private bool blockCancellation = false;

        public SortPlaylistsCommandHandler(
            IHubContext<ProgressHub> progressHub,
            ILogger<CreatePlaylistsCommandHandler> logger,
            IMapper mapper)
        {
            this.progressHub = progressHub;
            this.logger = logger;
            this.mapper = mapper;
        }

        public async Task<OperationResult> HandleAsync(SortPlaylistsCommand command, CancellationToken cancellationToken)
        {
            OperationResult result;

            try
            {
                this.cancellationToken = cancellationToken;

                if (command.AccessToken == null)
                {
                    throw new APIUnauthorizedException();
                }

                if (HasNoRequiredParameters(command))
                {
                    result = OperationResult.Failure(StatusCodes.BadRequest, ErrorMessages.MissingParemeters);
                    return await Task.FromResult(result);
                }

                SetupProgressManager(command);
                SetupSpotifyClient(command);

                var playlists = await GetPlaylistsWithTracks(command.PlaylistIds);

                if (command.SortByAudioFeatures)
                {
                    playlists = await GetPlaylistsWithAudioFeatures(playlists);
                }

                playlists = SortPlaylists(playlists, command.SortBy);

                await ReplacePlaylists(playlists);

                result = OperationResult.Success();
                return await Task.FromResult(result);
            }
            catch (OperationCanceledException)
            {
                result = OperationResult.Failure(StatusCodes.Ok, ErrorMessages.RequestCancelled);
                return await Task.FromResult(result);
            }
            catch (APIUnauthorizedException)
            {
                result = OperationResult.Failure(StatusCodes.Unauthorized, ErrorMessages.SessionExpired);
                return await Task.FromResult(result);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "An unexpected error occurred.");
                result = OperationResult.Failure(StatusCodes.InternalServerError, ErrorMessages.UnexpectedError);
                return await Task.FromResult(result);
            }
        }

        private bool HasNoRequiredParameters(SortPlaylistsCommand command)
        {
            return command.PlaylistIds?.Count == 0 || command.SortBy?.Count == 0;
        }

        private void SetupProgressManager(SortPlaylistsCommand command)
        {
            var taskWeight = command.TaskWeight * (command.SortByAudioFeatures ? 3 : 2);
            progressManager = new ProgressManager(progressHub, command.ConnectionId, taskWeight);
        }

        private void SetupSpotifyClient(SortPlaylistsCommand command)
        {
            var config = SpotifyClientConfig
              .CreateDefault(command.AccessToken)
              .WithRetryHandler(new SimpleRetryHandler() { RetryTimes = 30, RetryAfter = TimeSpan.FromSeconds(1), TooManyRequestsConsumesARetry = false });

            spotify = new SpotifyClient(config);
        }

        private async Task<IDictionary<string, IEnumerable<Track>>> GetPlaylistsWithTracks(IEnumerable<string> playlistIds)
        {
            var playlistsWithTracks = new Dictionary<string, IEnumerable<Track>>();
            var initialTrackCount = 0;
            var filteredTrackCount = 0;

            foreach (var playlistId in playlistIds)
            {
                var tracks = await GetTracksFromPlaylist(playlistId);
                initialTrackCount += tracks.Count();

                var filteredTracks = tracks.GroupBy(x => x?.Id)
                                           .Select(x => x.First())
                                           .Where(x => !x.IsLocal)
                                           .ToList();
                filteredTrackCount += filteredTracks.Count();

                playlistsWithTracks.Add(playlistId, filteredTracks);
            }

            progressManager.ProgressMultiplier = (float)initialTrackCount / filteredTrackCount;

            return playlistsWithTracks;
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
                    Limit = MaxItemsPerRequest,
                    Offset = index * MaxItemsPerRequest
                };

                var requestedTracks = await spotify.Playlists.GetItems(playlistId, request);
                playlistSize = requestedTracks.Total.GetValueOrDefault();
                playlistTracks.AddRange(requestedTracks.Items.Select(x => mapper.Map<Track>(x.Track)));

                index++;
                await CheckProgress("Preparing tracks");
            }
            while (playlistTracks.Count < playlistSize);

            return playlistTracks;
        }

        private async Task<IDictionary<string, IEnumerable<Track>>> GetPlaylistsWithAudioFeatures(IDictionary<string, IEnumerable<Track>> playlists)
        {
            var playlistsWithAudioFeatures = new Dictionary<string, IEnumerable<Track>>();

            foreach (var (playlistId, tracks) in playlists)
            {
                playlistsWithAudioFeatures.Add(playlistId, await GetTracksWithAudioFeatures(tracks));
            }

            return playlistsWithAudioFeatures;
        }

        private async Task<IEnumerable<Track>> GetTracksWithAudioFeatures(IEnumerable<Track> tracks)
        {
            var index = 0;
            var audioFeaturesList = new List<TrackAudioFeatures>();

            while (audioFeaturesList.Count < tracks.Count())
            {
                var request = new TracksAudioFeaturesRequest(tracks.Skip(index * MaxItemsPerRequest)
                                                                   .Take(MaxItemsPerRequest)
                                                                   .Select(x => x.Id)
                                                                   .ToList());

                var requestedAudioFeatures = await spotify.Tracks.GetSeveralAudioFeatures(request);
                audioFeaturesList.AddRange(requestedAudioFeatures.AudioFeatures);

                index++;
                await CheckProgress("Collecting audio features");
            }

            foreach (var (track, audioFeatures) in tracks.Zip(audioFeaturesList, (track, audioFeatures) => (track, audioFeatures)))
            {
                track.AudioFeatures = mapper.Map<AudioFeatures>(audioFeatures);
            }

            return tracks;
        }

        private IDictionary<string, IEnumerable<Track>> SortPlaylists(IDictionary<string, IEnumerable<Track>> playlists, IEnumerable<string> sortBy)
        {
            var sortedPlaylists = new Dictionary<string, IEnumerable<Track>>();

            foreach (var (playlistId, tracks) in playlists)
            {
                sortedPlaylists.Add(playlistId, SortTracks(tracks, sortBy));
            }

            return sortedPlaylists;
        }

        private List<Track> SortTracks(IEnumerable<Track> tracks, IEnumerable<string> sortBy)
        {
            var sortByPhrase = string.Join(",", sortBy);
            var sortedTracks = tracks.AsQueryable()
                                     .OrderBy(sortByPhrase)
                                     .ToList();

            return sortedTracks;
        }

        private async Task ReplacePlaylists(IDictionary<string, IEnumerable<Track>> playlists)
        {
            blockCancellation = true;
            await progressManager.ReportCancellationBlock();

            foreach (var (playlistId, tracks) in playlists)
            {
                await spotify.Playlists.ReplaceItems(playlistId, new PlaylistReplaceItemsRequest(new List<string>()));
                await CheckProgress("Replacing tracks");

                for (var i = 0; i < (double)tracks.Count() / MaxItemsPerRequest; i++)
                {
                    var request = new PlaylistAddItemsRequest(tracks.Skip(i * MaxItemsPerRequest)
                                                                    .Take(MaxItemsPerRequest)
                                                                    .Select(x => x.Uri)
                                                                    .ToList());

                    await spotify.Playlists.AddItems(playlistId, request);
                    await CheckProgress("Replacing tracks");
                }
            }

            await CheckProgress("Complete", true);
        }

        private async Task CheckProgress(string description, bool complete = false)
        {
            if (!blockCancellation)
            {
                cancellationToken.ThrowIfCancellationRequested();
            }
            await progressManager.ReportProgress(description, complete);
        }
    }
}
