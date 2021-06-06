using Sortify.Contracts.Models;
using Sortify.Contracts.Requests.Queries;
using Sortify.Contracts.Responses.Base;
using System.Collections.Generic;

namespace Sortify.Contracts.Responses
{
    /// <summary>
    /// Response with current user's playlists.
    /// </summary>
    public class GetPlaylistsResponse : IResponse<GetPlaylistsQuery>
    {
        /// <summary>
        /// Current user's playlists.
        /// </summary>
        public IEnumerable<Playlist> Playlists { get; set; }

        /// <summary>
        /// Whether the whole request is finished.
        /// </summary>
        public bool IsFinished { get; set; }

        /// <summary>
        /// Index at which the request left off.
        /// </summary>
        public int Index { get; set; }
    }
}
