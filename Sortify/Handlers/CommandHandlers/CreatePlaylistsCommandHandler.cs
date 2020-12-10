﻿using AutoMapper;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using Sortify.Contracts.Enums;
using Sortify.Contracts.Models;
using Sortify.Contracts.Requests.Commands;
using Sortify.Contracts.Responses;
using Sortify.Extensions;
using Sortify.Helpers;
using Sortify.Hubs;
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

        private readonly IHubContext<ProgressHub> progressHub;
        private readonly ILogger<CreatePlaylistsCommandHandler> logger;
        private readonly IMapper mapper;

        private ProgressManager progressManager;
        private SpotifyClient spotify;

        public CreatePlaylistsCommandHandler(
            IHubContext<ProgressHub> progressHub,
            ILogger<CreatePlaylistsCommandHandler> logger,
            IMapper mapper)
        {
            this.progressHub = progressHub;
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

                SetupProgressManager(command);
                SetupSpotifyClient(command);

                var tracks = await GetTracksFromAllPlaylists(command.PlaylistIds);

                if (command.SortByAudioFeatures)
                {
                    tracks = await GetTracksWithAudioFeatures(tracks);
                }

                var sortedTracks = SortTracks(tracks, command.SortBy);
                var playlists = SplitIntoPlaylists(sortedTracks, command);
                var playlistValidationErrors = ValidatePlaylists(playlists);

                if (playlistValidationErrors.Any())
                {
                    result = OperationResult.Failure(playlistValidationErrors.FirstOrDefault());
                    return await Task.FromResult(result);
                }

                await CreatePlaylists(playlists, command);

                result = OperationResult.Success();
                return await Task.FromResult(result);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "An unexpected error occurred.");
                result = OperationResult.Failure("Something went wrong. Please try again later.");
                return await Task.FromResult(result);
            }
        }

        private bool HasNoRequiredParameters(CreatePlaylistsCommand command)
        {
            return command.AccessToken == null || command.PlaylistIds?.Count == 0 || command.SortBy?.Count == 0 || command.Name == null;
        }

        private void SetupProgressManager(CreatePlaylistsCommand command)
        {
            var taskWeight = command.TaskWeight * (command.SortByAudioFeatures ? 3 : 2);
            progressManager = new ProgressManager(progressHub, command.ConnectionId, taskWeight);
        }

        private void SetupSpotifyClient(CreatePlaylistsCommand command)
        {
            var config = SpotifyClientConfig
              .CreateDefault(command.AccessToken)
              .WithRetryHandler(new SimpleRetryHandler() { RetryTimes = 3, RetryAfter = TimeSpan.FromMilliseconds(500) });

            spotify = new SpotifyClient(config);
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

            progressManager.ProgressMultiplier = (float)tracks.Count / filteredTracks.Count;

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
                await progressManager.ReportProgress("Preparing tracks");
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
                await progressManager.ReportProgress("Collecting audio features");
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

        private List<string> ValidatePlaylists(List<List<Track>> playlists)
        {
            const int MaxPlaylistSize = 10000;
            const int MaxPlaylists = 100;

            var playlistValidationErrors = new List<string>();

            var playlistTooBig = playlists.Any(x => x.Count > MaxPlaylistSize);

            if (playlistTooBig)
            {
                playlistValidationErrors.Add($"One of the created playlists exceeds the limit of {MaxPlaylistSize} tracks allowed. Try splitting into more playlists.");
            }

            var tooManyPlaylists = playlists.Count > MaxPlaylists;

            if (tooManyPlaylists)
            {
                playlistValidationErrors.Add($"Created playlists exceed the limit of {MaxPlaylists} allowed. Try splitting into bigger playlists.");
            }

            return playlistValidationErrors;
        }

        private async Task CreatePlaylists(IEnumerable<IEnumerable<Track>> playlists, CreatePlaylistsCommand command)
        {
            var user = await spotify.UserProfile.Current();
            var reversedPlaylists = playlists.Reverse();

            foreach (var (playlist, index) in reversedPlaylists.Select((playlist, index) => (playlist, index)))
            {
                var playlistCount = playlists.Count();
                var playlistNumber = playlistCount - index;
                var playlistName = GeneratePlaylistName(command, playlistNumber, playlistCount);

                var playlistCreateRequest = new PlaylistCreateRequest(playlistName)
                {
                    Public = !command.IsSecret,
                    Description = command.Description
                };

                var createdPlaylist = await spotify.Playlists.Create(user.Id, playlistCreateRequest);

                for (int i = 0; i < (double)playlist.Count() / maxItemsPerRequest; i++)
                {
                    var request = new PlaylistAddItemsRequest(playlist.Skip(i * maxItemsPerRequest)
                                                                      .Take(maxItemsPerRequest)
                                                                      .Select(x => x.Uri)
                                                                      .ToList());

                    var addedTracks = await spotify.Playlists.AddItems(createdPlaylist.Id, request);
                    await progressManager.ReportProgress("Creating playlists");
                }
            }
            await progressManager.ReportCompletion();
        }

        private string GeneratePlaylistName(CreatePlaylistsCommand command, int number, int playlistCount)
        {
            var numeral = string.Empty;
            var name = command.Name;

            if (command.NumberingStyle.HasValue)
            {
                _ = (command.NumberingStyle switch
                {
                    NumberingStyle.Arabic => numeral = number.ToString(),
                    NumberingStyle.Roman => numeral = number.ToRomanNumeral(),
                    NumberingStyle.UpperCaseRoman => numeral = number.ToRomanNumeral(true),
                    NumberingStyle.Alphabet => numeral = number.ToAlphabetNumeral(),
                    NumberingStyle.UpperCaseAlphabet => numeral = number.ToAlphabetNumeral(true),
                    _ => number.ToString()
                });
            }

            if (command.NumberingPlacement.HasValue)
            {
                if (command.NumberingPlacement == NumberingPlacement.Before)
                {
                    numeral = $"{numeral}. ";
                    name = $"{numeral}{name.TrimNumeral(numeral)}";
                } 
                else
                {
                    numeral = $" {numeral}";
                    name = $"{name.TrimNumeral(numeral)}{numeral}";
                }
            }

            return name;
        }
    }
}
