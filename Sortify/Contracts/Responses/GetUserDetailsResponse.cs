using Sortify.Contracts.Models;
using Sortify.Contracts.Requests.Queries;
using Sortify.Contracts.Responses.Base;

namespace Sortify.Contracts.Responses
{
    public class GetUserDetailsResponse : IResponse<GetUserDetailsQuery>
    {
        public UserDetails UserDetails { get; set; }
    }
}
