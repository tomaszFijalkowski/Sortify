using AutoMapper;
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
        private readonly IMapper mapper;

        public GetPlaylistsQueryHandler(IMapper mapper)
        {
            this.mapper = mapper;
        }

        public async Task<OperationResult<GetPlaylistsQuery, GetPlaylistsResponse>> HandleAsync(GetPlaylistsQuery query)
        {
            OperationResult<GetPlaylistsQuery, GetPlaylistsResponse> result;

            try
            {
                if (query?.AccessToken == null)
                {
                    result = OperationResult<GetPlaylistsQuery, GetPlaylistsResponse>.Failure("Parameter is missing in the request");
                    return await Task.FromResult(result);
                }

                var spotify = new SpotifyClient(query.AccessToken, "Bearer");
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
                var exception = ex; // TODO log exception
                result = OperationResult<GetPlaylistsQuery, GetPlaylistsResponse>.Failure("Unexpected exception occured");
                return await Task.FromResult(result);
            }
        }
    }
}
