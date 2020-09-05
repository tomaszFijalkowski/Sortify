using Sortify.Contracts.Requests.Queries;
using SpotifyAPI.Web;
using System.Collections.Generic;

namespace Sortify.Contracts.Responses
{
    public class GetPlaylistsResponse : IResponse<GetPlaylistsQuery>
    {
        public IEnumerable<Playlist> Playlists { get; set; }
    }

    public class Playlist
    {
        public string Id { get; set; }

        public string Name { get; set; }

        public string Owner { get; set; }

        public int Size { get; set; }

        public Image Image { get; set; }
    }
}
