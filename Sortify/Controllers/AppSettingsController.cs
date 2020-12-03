using Microsoft.AspNetCore.Mvc;
using Sortify.Contracts.Requests.Queries;
using Sortify.Contracts.Responses;
using Sortify.Handlers.QueryHandlers;
using System.Threading.Tasks;

namespace Sortify.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AppSettingsController : ControllerBase
    {
        private readonly IQueryHandler<GetAppSettingsQuery, GetAppSettingsResponse> getAppSettingsQueryHandler;

        public AppSettingsController(
            IQueryHandler<GetAppSettingsQuery, GetAppSettingsResponse> getAppSettingsQueryHandler)
        {
            this.getAppSettingsQueryHandler = getAppSettingsQueryHandler;
        }

        [HttpGet]
        public async Task<OperationResult<GetAppSettingsQuery, GetAppSettingsResponse>> GetAppSettings()
        {
            return await getAppSettingsQueryHandler.HandleAsync(new GetAppSettingsQuery());
        }
    }
}
