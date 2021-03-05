using Sortify.Contracts.Requests.Queries.Base;

namespace Sortify.Contracts.Requests.Queries
{
    /// <summary>
    /// Query for getting current user's details.
    /// </summary>
    public class GetUserDetailsQuery : IQuery
    {
        /// <summary>
        /// AccessToken required by Spotify Web API.
        /// </summary>
        public string AccessToken { get; set; }
    }
}
