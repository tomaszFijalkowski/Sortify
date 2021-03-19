using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Sortify.Contracts.Requests.Commands;
using Sortify.Contracts.Requests.Queries;
using Sortify.Contracts.Responses;
using Sortify.Contracts.Responses.Base;
using Sortify.Handlers.CommandHandlers.Base;
using Sortify.Handlers.QueryHandlers.Base;

namespace Sortify.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PlaylistController : ControllerBase
    {
        private readonly IQueryHandler<GetPlaylistsQuery, GetPlaylistsResponse> getPlaylistsQueryHandler;
        private readonly ICommandHandler<SortPlaylistsCommand> sortPlaylistsCommandHandler;
        private readonly ICommandHandler<CreatePlaylistsCommand> createPlaylistsCommandHandler;

        public PlaylistController(
            IQueryHandler<GetPlaylistsQuery, GetPlaylistsResponse> getPlaylistsQueryHandler,
            ICommandHandler<SortPlaylistsCommand> sortPlaylistsCommandHandler,
            ICommandHandler<CreatePlaylistsCommand> createPlaylistsCommandHandler)
        {
            this.getPlaylistsQueryHandler = getPlaylistsQueryHandler;
            this.sortPlaylistsCommandHandler = sortPlaylistsCommandHandler;
            this.createPlaylistsCommandHandler = createPlaylistsCommandHandler;
        }

        [HttpGet]
        public async Task<OperationResult<GetPlaylistsQuery, GetPlaylistsResponse>> GetPlaylists(string ownerId)
        {
            var accessToken = Request.Headers["Authorization"];
            var query = new GetPlaylistsQuery() { AccessToken = accessToken, OwnerId = ownerId };
            return await getPlaylistsQueryHandler.HandleAsync(query);
        }

        [HttpPost]
        [Route("sort")]
        public async Task<OperationResult> SortPlaylists(SortPlaylistsCommand command)
        {
            command.AccessToken = Request.Headers["Authorization"];
            return await sortPlaylistsCommandHandler.HandleAsync(command);
        }

        [HttpPost]
        [Route("create")]
        public async Task<OperationResult> CreatePlaylists(CreatePlaylistsCommand command)
        {
            command.AccessToken = Request.Headers["Authorization"];
            return await createPlaylistsCommandHandler.HandleAsync(command);
        }
    }
}
