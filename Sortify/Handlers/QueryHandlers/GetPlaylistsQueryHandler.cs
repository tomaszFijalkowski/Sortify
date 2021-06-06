using AutoMapper;
using Microsoft.Extensions.Logging;
using Sortify.Contracts.Models;
using Sortify.Contracts.Requests.Queries;
using Sortify.Contracts.Responses;
using Sortify.Contracts.Responses.Base;
using Sortify.Handlers.QueryHandlers.Base;
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
        private const int MaxRequests = 40;
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
                    throw new APIUnauthorizedException();
                }

                var config = SpotifyClientConfig
                  .CreateDefault(query.AccessToken)
                  .WithRetryHandler(new SimpleRetryHandler() { RetryTimes = 30, RetryAfter = TimeSpan.FromSeconds(1), TooManyRequestsConsumesARetry = false });

                spotify = new SpotifyClient(config);

                var playlistsTuple = await GetUserPlaylists(query.Index, query.OwnerId);

                var response = new GetPlaylistsResponse
                {
                    Playlists = playlistsTuple.Item1,
                    IsFinished = playlistsTuple.Item2,
                    Index = playlistsTuple.Item3
                };

                result = OperationResult<GetPlaylistsQuery, GetPlaylistsResponse>.Success(response);
                return await Task.FromResult(result);
            }
            catch (APIUnauthorizedException)
            {
                result = OperationResult<GetPlaylistsQuery, GetPlaylistsResponse>.Failure(StatusCodes.Unauthorized, ErrorMessages.SessionExpired);
                return await Task.FromResult(result);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "An unexpected error occurred.");
                result = OperationResult<GetPlaylistsQuery, GetPlaylistsResponse>.Failure(StatusCodes.InternalServerError, ErrorMessages.UnexpectedError);
                return await Task.FromResult(result);
            }
        }

        private async Task<(IEnumerable<Playlist>, bool, int)> GetUserPlaylists(int index, string ownerId)
        {
            var requestCount = 0;
            var previousTotalCount = index * MaxItemsPerRequest;
            var isFinished = false;

            var playlists = new List<Playlist>();

            do
            {
                var request = new PlaylistCurrentUsersRequest
                {
                    Limit = MaxItemsPerRequest,
                    Offset = index * MaxItemsPerRequest
                };

                var requestedPlaylists = await spotify.Playlists.CurrentUsers(request);
                var totalCount = requestedPlaylists.Total.GetValueOrDefault();
                playlists.AddRange(requestedPlaylists.Items.Select(x => mapper.Map<Playlist>(x)));

                index++;
                requestCount++;

                if (playlists.Count + previousTotalCount == totalCount)
                {
                    isFinished = true;
                }
            }
            while (requestCount < MaxRequests && isFinished == false);

            playlists = playlists.Where(x => ownerId == null || x.OwnerId == ownerId).ToList();

            return (playlists, isFinished, index);
        }
    }
}
