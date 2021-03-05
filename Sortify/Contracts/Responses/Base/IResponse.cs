using Sortify.Contracts.Requests.Base;

namespace Sortify.Contracts.Responses.Base
{
    /// <summary>
    /// System response to exact request <see cref="TRequest"/>.
    /// </summary>
    public interface IResponse<TRequest> where TRequest : IRequest
    {
    }
}
