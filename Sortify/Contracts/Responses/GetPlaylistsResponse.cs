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
    }
}
