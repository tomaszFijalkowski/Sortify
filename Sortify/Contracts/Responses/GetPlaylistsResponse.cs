using Sortify.Contracts.Models;
using Sortify.Contracts.Requests.Queries;
using System.Collections.Generic;

namespace Sortify.Contracts.Responses
{
    public class GetPlaylistsResponse : IResponse<GetPlaylistsQuery>
    {
        public IEnumerable<Playlist> Playlists { get; set; }
    }
}
