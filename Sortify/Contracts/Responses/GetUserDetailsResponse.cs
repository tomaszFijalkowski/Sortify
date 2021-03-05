using Sortify.Contracts.Models;
using Sortify.Contracts.Requests.Queries;
using Sortify.Contracts.Responses.Base;

namespace Sortify.Contracts.Responses
{
    /// <summary>
    /// Response with current user's details.
    /// </summary>
    public class GetUserDetailsResponse : IResponse<GetUserDetailsQuery>
    {
        /// <summary>
        /// Current user's details.
        /// </summary>
        public UserDetails UserDetails { get; set; }
    }
}
