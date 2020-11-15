using AutoMapper;
using Microsoft.Extensions.Logging;
using Sortify.Contracts.Requests.Queries;
using Sortify.Contracts.Responses;
using SpotifyAPI.Web;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Sortify.Handlers.QueryHandlers
{
    public class GetPlaylistsQueryHandler : IQueryHandler<GetPlaylistsQuery, GetPlaylistsResponse>
    {
        private readonly ILogger<GetPlaylistsQueryHandler> logger;
        private readonly IMapper mapper;

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
                    result = OperationResult<GetPlaylistsQuery, GetPlaylistsResponse>.Failure("One or more parameters are missing in the request.");
                    return await Task.FromResult(result);
                }

                var config = SpotifyClientConfig
                  .CreateDefault(query.AccessToken)
                  .WithRetryHandler(new SimpleRetryHandler() { RetryTimes = 3, RetryAfter = TimeSpan.FromMilliseconds(500) });

                var spotify = new SpotifyClient(config);

                var playlists = await spotify.Playlists.CurrentUsers();
                var response = new GetPlaylistsResponse
                {
                    Playlists = playlists.Items.Select(x => mapper.Map<Playlist>(x))
                };

                result = OperationResult<GetPlaylistsQuery, GetPlaylistsResponse>.Success(response);
                return await Task.FromResult(result);
            } 
            catch (Exception ex)
            {
                logger.LogError(ex, "An unexpected error occurred.");
                result = OperationResult<GetPlaylistsQuery, GetPlaylistsResponse>.Failure("Something went wrong, please try again later.");
                return await Task.FromResult(result);
            }
        }
    }
}
