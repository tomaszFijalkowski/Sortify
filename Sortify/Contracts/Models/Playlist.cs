using SpotifyAPI.Web;

namespace Sortify.Contracts.Models
{
    public class Playlist
    {
        public string Id { get; set; }

        public string Name { get; set; }

        public string OwnerId { get; set; }

        public string OwnerName { get; set; }

        public int Size { get; set; }

        public Image Image { get; set; }
    }
}
