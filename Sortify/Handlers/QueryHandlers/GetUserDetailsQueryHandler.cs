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
using System.Threading.Tasks;

namespace Sortify.Handlers.QueryHandlers
{
    public class GetUserDetailsQueryHandler : IQueryHandler<GetUserDetailsQuery, GetUserDetailsResponse>
    {
        private readonly ILogger<GetUserDetailsQueryHandler> logger;
        private readonly IMapper mapper;
        private SpotifyClient spotify;

        public GetUserDetailsQueryHandler(ILogger<GetUserDetailsQueryHandler> logger, IMapper mapper)
        {
            this.logger = logger;
            this.mapper = mapper;
        }

        public async Task<OperationResult<GetUserDetailsQuery, GetUserDetailsResponse>> HandleAsync(GetUserDetailsQuery query)
        {
            OperationResult<GetUserDetailsQuery, GetUserDetailsResponse> result;

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

                var response = new GetUserDetailsResponse
                {
                    UserDetails = await GetUserDetails()
                };

                result = OperationResult<GetUserDetailsQuery, GetUserDetailsResponse>.Success(response);
                return await Task.FromResult(result);
            }
            catch (APIUnauthorizedException)
            {
                result = OperationResult<GetUserDetailsQuery, GetUserDetailsResponse>.Failure(StatusCodes.Unauthorized, ErrorMessages.SessionExpired);
                return await Task.FromResult(result);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "An unexpected error occurred.");
                result = OperationResult<GetUserDetailsQuery, GetUserDetailsResponse>.Failure(StatusCodes.InternalServerError, ErrorMessages.UnexpectedError);
                return await Task.FromResult(result);
            }
        }

        private async Task<UserDetails> GetUserDetails()
        {
            var currentUser = await spotify.UserProfile.Current();
            var userDerails = mapper.Map<UserDetails>(currentUser);

            return userDerails;
        }
    }
}
