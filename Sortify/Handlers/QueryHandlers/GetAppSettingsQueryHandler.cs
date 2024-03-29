﻿using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Sortify.Contracts.Requests.Queries;
using Sortify.Contracts.Responses;
using Sortify.Contracts.Responses.Base;
using Sortify.Handlers.QueryHandlers.Base;
using Sortify.Helpers;
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
                var appSettings = new AppSettings
                {
                    LoginUrl = configuration.GetValue<string>("AuthConfig:LoginUrl"),
                    RedirectUri = configuration.GetValue<string>("AuthConfig:RedirectUri"),
                    SilentRefreshRedirectUri = configuration.GetValue<string>("AuthConfig:SilentRefreshRedirectUri"),
                    ClientId = configuration.GetValue<string>("AuthConfig:ClientId"),
                    ClientScope = configuration.GetValue<string>("AuthConfig:ClientScope"),
                    TaskHubUrl = configuration.GetValue<string>("TaskHubUrl"),
                    TimeoutWarningThreshold = configuration.GetValue<int>("TimeoutWarningThreshold")
                };

                var response = new GetAppSettingsResponse { AppSettings = appSettings };

                result = OperationResult<GetAppSettingsQuery, GetAppSettingsResponse>.Success(response);
                return await Task.FromResult(result);
            } 
            catch (Exception ex)
            {
                logger.LogError(ex, "An unexpected error occurred.");
                result = OperationResult<GetAppSettingsQuery, GetAppSettingsResponse>.Failure(StatusCodes.InternalServerError, ErrorMessages.UnexpectedError);
                return await Task.FromResult(result);
            }
        }
    }
}
