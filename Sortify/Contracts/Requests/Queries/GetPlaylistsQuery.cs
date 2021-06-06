using Sortify.Contracts.Requests.Queries.Base;

namespace Sortify.Contracts.Requests.Queries
{
    /// <summary>
    /// Query for current user's playlists.
    /// </summary>
    public class GetPlaylistsQuery : IQuery
    {
        /// <summary>
        /// AccessToken required by Spotify Web API.
        /// </summary>
        public string AccessToken { get; set; }

        /// <summary>
        /// Narrows the playlists by OwnerId if specified.
        /// </summary>
        public string OwnerId { get; set; }

        /// <summary>
        /// Index at which the request left off.
        /// </summary>
        public int Index { get; set; }
    }
}
