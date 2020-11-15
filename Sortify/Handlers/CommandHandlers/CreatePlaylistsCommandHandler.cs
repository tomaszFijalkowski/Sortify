using AutoMapper;
using Microsoft.Extensions.Logging;
using Sortify.Contracts.Requests.Commands;
using Sortify.Contracts.Responses;
using System;
using System.Threading.Tasks;

namespace Sortify.Handlers.QueryHandlers
{
    public class CreatePlaylistsCommandHandler : ICommandHandler<CreatePlaylistsCommand>
    {
        private readonly ILogger<CreatePlaylistsCommandHandler> logger;
        private readonly IMapper mapper;

        public CreatePlaylistsCommandHandler(ILogger<CreatePlaylistsCommandHandler> logger, IMapper mapper)
        {
            this.logger = logger;
            this.mapper = mapper;
        }

        public async Task<OperationResult> HandleAsync(CreatePlaylistsCommand command)
        {
            OperationResult result;

            try
            {
                if (HasNoRequiredParameters(command))
                {
                    result = OperationResult.Failure("One or more parameters are missing in the request.");
                    return await Task.FromResult(result);
                }

                result = OperationResult.Success();
                return await Task.FromResult(result);
            } 
            catch (Exception ex)
            {
                logger.LogError(ex, "An unexpected error occurred.");
                result = OperationResult.Failure("Something went wrong, please try again later.");
                return await Task.FromResult(result);
            }
        }

        private bool HasNoRequiredParameters(CreatePlaylistsCommand command)
        {
            return command.AccessToken == null || command.PlaylistIds?.Count == 0 || command.SortBy?.Count == 0 || command.Name == null;
        }
    }
}
