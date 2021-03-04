using Sortify.Contracts.Requests.Queries.Base;

namespace Sortify.Contracts.Requests.Queries
{
    public class GetPlaylistsQuery : IQuery
    {
        public string AccessToken { get; set; }

        public string OwnerId { get; set; }
    }
}
