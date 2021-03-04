using Sortify.Contracts.Requests.Commands.Base;
using Sortify.Contracts.Responses.Base;
using System.Threading;
using System.Threading.Tasks;

namespace Sortify.Handlers.CommandHandlers.Base
{
    /// <summary>
    /// Handler responsible for give <see cref="TCommand"/>
    /// </summary>
    /// <typeparam name="TCommand">Command (to modify system) to be handled</typeparam>
    public interface ICommandHandler<TCommand> : ICommandHandler
        where TCommand : ICommand
    {
        /// <summary>
        /// Handle command
        /// </summary>
        /// <param name="command">Command</param>
        /// <returns>Result of handling command</returns>
        Task<OperationResult> HandleAsync(TCommand command, CancellationToken cancellationToken);
    }

    /// <summary>
    /// Handler responsible for give <see cref="TCommand"/>
    /// </summary>
    /// <typeparam name="TCommand">Command (to modify system) to be handled</typeparam>
    /// <typeparam name="TResponse">Response on handling command</typeparam>
    public interface ICommandHandler<TCommand, TResponse> : ICommandHandler
        where TCommand : ICommand where TResponse : IResponse<TCommand>
    {
        /// <summary>
        /// Handle command
        /// </summary>
        /// <param name="command">Command</param>
        /// <returns>Result with corresponding <see cref="TResponse"/></returns>
        Task<OperationResult<TCommand, TResponse>> HandleAsync(TCommand command, CancellationToken cancellationToken);
    }

    /// <summary>
    /// Marker interface
    /// </summary>
    public interface ICommandHandler
    {
    }
}
