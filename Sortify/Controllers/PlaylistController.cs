using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Sortify.Contracts.Requests.Queries;
using Sortify.Contracts.Responses;
using Sortify.Handlers.QueryHandlers;

namespace Sortify.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PlaylistController : ControllerBase
    {
        private readonly IQueryHandler<GetPlaylistsQuery, GetPlaylistsResponse> getPlaylistsQueryHandler;

        public PlaylistController(IQueryHandler<GetPlaylistsQuery, GetPlaylistsResponse> getPlaylistsQueryHandler)
        {
            this.getPlaylistsQueryHandler = getPlaylistsQueryHandler;
        }

        [HttpGet]
        public async Task<OperationResult<GetPlaylistsQuery, GetPlaylistsResponse>> Get()
        {
            var accessToken = Request.Headers["Authorization"];
            var query = new GetPlaylistsQuery() { AccessToken = accessToken };
            return await getPlaylistsQueryHandler.HandleAsync(query);
        }
    }
}
