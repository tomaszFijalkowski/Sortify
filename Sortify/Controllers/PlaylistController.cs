using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Sortify.Contracts.Requests.Commands;
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
        private readonly ICommandHandler<CreatePlaylistsCommand> createPlaylistsCommandHandler;

        public PlaylistController(
            IQueryHandler<GetPlaylistsQuery, GetPlaylistsResponse> getPlaylistsQueryHandler,
            ICommandHandler<CreatePlaylistsCommand> createPlaylistsCommandHandler)
        {
            this.getPlaylistsQueryHandler = getPlaylistsQueryHandler;
            this.createPlaylistsCommandHandler = createPlaylistsCommandHandler;
        }

        [HttpGet]
        public async Task<OperationResult<GetPlaylistsQuery, GetPlaylistsResponse>> GetPlaylists()
        {
            var accessToken = Request.Headers["Authorization"];
            var query = new GetPlaylistsQuery() { AccessToken = accessToken };
            return await getPlaylistsQueryHandler.HandleAsync(query);
        }

        [HttpPost]
        [Route("create")]
        public async Task<OperationResult> CreatePlaylists(CreatePlaylistsCommand command, CancellationToken cancellationToken)
        {
            command.AccessToken = Request.Headers["Authorization"];
            return await createPlaylistsCommandHandler.HandleAsync(command, cancellationToken);
        }
    }
}
