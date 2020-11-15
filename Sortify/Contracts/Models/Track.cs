using SpotifyAPI.Web;

namespace Sortify.Contracts.Models
{
    public class Track
    {
        public string Id { get; set; }

        public string ArtistName { get; set; }

        public string AlbumName { get; set; }

        public string AlbumReleaseDate { get; set; }

        public int TrackDuration { get; set; }

        public string TrackName { get; set; }

        public int TrackNumber { get; set; }

        public int TrackPopularity { get; set; }

        public TrackAudioFeatures AudioFeatures { get; set; }
    }
}
