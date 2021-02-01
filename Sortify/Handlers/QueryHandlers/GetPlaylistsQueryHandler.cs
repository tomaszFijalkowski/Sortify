using AutoMapper;
using Microsoft.Extensions.Logging;
using Sortify.Contracts.Models;
using Sortify.Contracts.Requests.Queries;
using Sortify.Contracts.Responses;
using Sortify.Helpers;
using SpotifyAPI.Web;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Sortify.Handlers.QueryHandlers
{
    public class GetPlaylistsQueryHandler : IQueryHandler<GetPlaylistsQuery, GetPlaylistsResponse>
    {
        private const int MaxItemsPerRequest = 50;
        private readonly ILogger<GetPlaylistsQueryHandler> logger;
        private readonly IMapper mapper;
        private SpotifyClient spotify;

        public GetPlaylistsQueryHandler(ILogger<GetPlaylistsQueryHandler> logger, IMapper mapper)
        {
            this.logger = logger;
            this.mapper = mapper;
        }

        public async Task<OperationResult<GetPlaylistsQuery, GetPlaylistsResponse>> HandleAsync(GetPlaylistsQuery query)
        {
            OperationResult<GetPlaylistsQuery, GetPlaylistsResponse> result;

            try
            {
                if (query?.AccessToken == null)
                {
                    result = OperationResult<GetPlaylistsQuery, GetPlaylistsResponse>.Failure(ErrorMessages.MissingParemeters);
                    return await Task.FromResult(result);
                }

                var config = SpotifyClientConfig
                  .CreateDefault(query.AccessToken)
                  .WithRetryHandler(new SimpleRetryHandler() { RetryTimes = 3, RetryAfter = TimeSpan.FromMilliseconds(500) });

                spotify = new SpotifyClient(config);

                var response = new GetPlaylistsResponse
                {
                    Playlists = await GetUserPlaylists(query.OwnerId)
                };

                result = OperationResult<GetPlaylistsQuery, GetPlaylistsResponse>.Success(response);
                return await Task.FromResult(result);
            }
            catch (APIUnauthorizedException)
            {
                result = OperationResult<GetPlaylistsQuery, GetPlaylistsResponse>.Failure(ErrorMessages.SessionExpired);
                return await Task.FromResult(result);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "An unexpected error occurred.");
                result = OperationResult<GetPlaylistsQuery, GetPlaylistsResponse>.Failure(ErrorMessages.UnexpectedError);
                return await Task.FromResult(result);
            }
        }

        private async Task<IEnumerable<Playlist>> GetUserPlaylists(string ownerId)
        {
            var index = 0;
            var playlists = new List<Playlist>();

            int totalCount;
            do
            {
                var request = new PlaylistCurrentUsersRequest
                {
                    Limit = MaxItemsPerRequest,
                    Offset = index * MaxItemsPerRequest
                };

                var requestedPlaylists = await spotify.Playlists.CurrentUsers(request);
                totalCount = requestedPlaylists.Total.GetValueOrDefault();
                playlists.AddRange(requestedPlaylists.Items.Select(x => mapper.Map<Playlist>(x)));

                index++;
            }
            while (playlists.Count < totalCount);

            playlists = playlists.Where(x => ownerId == null || x.OwnerId == ownerId).ToList();

            return playlists;
        }
    }
}
