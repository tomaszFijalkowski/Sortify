using Sortify.Contracts.Requests.Commands.Base;
using System.Collections.Generic;

namespace Sortify.Contracts.Requests.Commands
{
    /// <summary>
    /// Command with parameters for sorting playlists.
    /// </summary>
    public class SortPlaylistsCommand : ICommand
    {
        /// <summary>
        /// Access token required by Spotify Web API.
        /// </summary>
        public string AccessToken { get; set; }

        /// <summary>
        /// Connection id used to report back progress.
        /// </summary>
        public string ConnectionId { get; set; }

        /// <summary>
        /// Estimated task weight used in progress calculation.
        /// </summary>
        public int TaskWeight { get; set; }

        /// <summary>
        /// List of playlists to sort - required.
        /// </summary>
        public IList<string> PlaylistIds { get; set; }

        /// <summary>
        /// List of properties to sort by - required.
        /// </summary>
        public IList<string> SortBy { get; set; }

        /// <summary>
        /// Whether should fetch audio features.
        /// </summary>
        public bool SortByAudioFeatures { get; set; }
    }
}
