using Sortify.Contracts.Requests;
using Sortify.Contracts.Responses;
using System.Threading.Tasks;

namespace Sortify.Handlers.QueryHandlers
{
    /// <summary>
    /// Handler responsible for given <see cref="TQuery"/>
    /// </summary>
    /// <typeparam name="TQuery">Query (retrieve something) to be handled</typeparam>
    /// <typeparam name="TResponse">Response on handling query</typeparam>
    public interface IQueryHandler<TQuery, TResponse> : IQueryHandler
        where TQuery : IQuery where TResponse : IResponse<TQuery>
    {
        /// <summary>
        /// Handle query
        /// </summary>
        /// <param name="query">Query</param>
        /// <returns>Result with corresponding <see cref="TResponse"/></returns>
        Task<OperationResult<TQuery, TResponse>> HandleAsync(TQuery query);
    }

    /// <summary>
    /// Marker interface
    /// </summary>
    public interface IQueryHandler
    {
    }
}
