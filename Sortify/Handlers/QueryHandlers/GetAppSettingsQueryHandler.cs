using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Sortify.Contracts.Requests.Queries;
using Sortify.Contracts.Responses;
using System;
using System.Threading.Tasks;

namespace Sortify.Handlers.QueryHandlers
{
    public class GetAppSettingsQueryHandler : IQueryHandler<GetAppSettingsQuery, GetAppSettingsResponse>
    {
        private readonly ILogger<GetAppSettingsQueryHandler> logger;
        private readonly IConfiguration configuration;

        public GetAppSettingsQueryHandler(ILogger<GetAppSettingsQueryHandler> logger, IConfiguration configuration)
        {
            this.logger = logger;
            this.configuration = configuration;
        }

        public async Task<OperationResult<GetAppSettingsQuery, GetAppSettingsResponse>> HandleAsync(GetAppSettingsQuery query)
        {
            OperationResult<GetAppSettingsQuery, GetAppSettingsResponse> result;

            try
            {
                var response = new GetAppSettingsResponse
                {
                    LoginUrl = configuration.GetValue<string>("AuthConfig:LoginUrl"),
                    RedirectUri = configuration.GetValue<string>("AuthConfig:RedirectUri"),
                    ClientId = configuration.GetValue<string>("AuthConfig:ClientId"),
                    ClientScope = configuration.GetValue<string>("AuthConfig:ClientScope")
                };

                result = OperationResult<GetAppSettingsQuery, GetAppSettingsResponse>.Success(response);
                return await Task.FromResult(result);
            } 
            catch (Exception ex)
            {
                logger.LogError(ex, "An unexpected error occurred.");
                result = OperationResult<GetAppSettingsQuery, GetAppSettingsResponse>.Failure("Something went wrong, please try again later.");
                return await Task.FromResult(result);
            }
        }
    }
}
