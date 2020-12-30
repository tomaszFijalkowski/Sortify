using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Sortify.Contracts.Requests.Queries;
using Sortify.Contracts.Responses;
using Sortify.Handlers.QueryHandlers;

namespace Sortify.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IQueryHandler<GetUserDetailsQuery, GetUserDetailsResponse> getUserDetailsQueryHandler;

        public UserController(
            IQueryHandler<GetUserDetailsQuery, GetUserDetailsResponse> getUserDetailsQueryHandler)
        {
            this.getUserDetailsQueryHandler = getUserDetailsQueryHandler;
        }

        [HttpGet]
        public async Task<OperationResult<GetUserDetailsQuery, GetUserDetailsResponse>> GetUserDetails()
        {
            var accessToken = Request.Headers["Authorization"];
            var query = new GetUserDetailsQuery() { AccessToken = accessToken };
            return await getUserDetailsQueryHandler.HandleAsync(query);
        }
    }
}
