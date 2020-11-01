using AutoMapper;
using Sortify.Contracts.Requests.Commands;
using Sortify.Contracts.Responses;
using System;
using System.Threading.Tasks;

namespace Sortify.Handlers.QueryHandlers
{
    public class CreatePlaylistsCommandHandler : ICommandHandler<CreatePlaylistsCommand>
    {
        private readonly IMapper mapper;

        public CreatePlaylistsCommandHandler(IMapper mapper)
        {
            this.mapper = mapper;
        }

        public async Task<OperationResult> HandleAsync(CreatePlaylistsCommand command)
        {
            OperationResult result;

            try
            {
                if (HasNoRequiredParameters(command))
                {
                    result = OperationResult.Failure("One or more parameters are missing in the request");
                    return await Task.FromResult(result);
                }

                result = OperationResult.Success();
                return await Task.FromResult(result);
            } 
            catch (Exception ex)
            {
                var exception = ex; // TODO log exception
                result = OperationResult.Failure("Unexpected exception occured");
                return await Task.FromResult(result);
            }
        }

        private bool HasNoRequiredParameters(CreatePlaylistsCommand command)
        {
            return command.AccessToken == null || command.PlaylistIds?.Count == 0 || command.SortBy?.Count == 0 || command.Name == null;
        }
    }
}
