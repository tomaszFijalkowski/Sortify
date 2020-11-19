using SpotifyAPI.Web;

namespace Sortify.Contracts.Models
{
    public class Track
    {
        public string Id { get; set; }

        public string ArtistName { get; set; }

        public string AlbumName { get; set; }

        public string AlbumReleaseDate { get; set; }

        public int Duration { get; set; }

        public string Name { get; set; }

        public int TrackNumber { get; set; }

        public int Popularity { get; set; }

        public AudioFeatures AudioFeatures { get; set; }
    }
}
