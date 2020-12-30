using Sortify.Contracts.Models;
using Sortify.Contracts.Requests.Queries;

namespace Sortify.Contracts.Responses
{
    public class GetUserDetailsResponse : IResponse<GetUserDetailsQuery>
    {
        public UserDetails UserDetails { get; set; }
    }
}
