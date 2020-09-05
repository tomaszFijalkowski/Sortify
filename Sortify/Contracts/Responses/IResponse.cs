using Sortify.Contracts.Requests;

namespace Sortify.Contracts.Responses
{
    /// <summary>
    /// System response to exact request <see cref="TRequest"/>
    /// </summary>
    public interface IResponse<TRequest> where TRequest : IRequest
    {
    }
}
