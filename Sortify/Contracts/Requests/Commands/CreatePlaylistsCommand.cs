using Sortify.Contracts.Enums;
using Sortify.Contracts.Requests.Commands.Base;
using System.Collections.Generic;

namespace Sortify.Contracts.Requests.Commands
{
    /// <summary>
    /// Command with parameters for creating playlists.
    /// </summary>
    public class CreatePlaylistsCommand : ICommand
    {
        /// <summary>
        /// Access token required by Spotify Web API.
        /// </summary>
        public string AccessToken { get; set; }

        /// <summary>
        /// Connection id used for reporting back progress and handling cancellation.
        /// </summary>
        public string ConnectionId { get; set; }

        /// <summary>
        /// Estimated task weight used in progress calculation.
        /// </summary>
        public int TaskWeight { get; set; }

        /// <summary>
        /// List of playlists to create from - required.
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

        /// <summary>
        /// Split every n tracks.
        /// </summary>
        public int? SplitByTracksNumber { get; set; }

        /// <summary>
        /// Split into n playlists.
        /// </summary>
        public int? SplitByPlaylistsNumber { get; set; }

        /// <summary>
        /// Whether SmartSplit is enabled.
        /// </summary>
        public bool SmartSplit { get; set; }

        /// <summary>
        /// Whether SmartSplit should consider albums or artists.
        /// </summary>
        public SmartSplitType? SmartSplitType { get; set; }

        /// <summary>
        /// Playlist name - required.
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// Whether numbering placement should be before or after the name.
        /// </summary>
        public NumberingPlacement? NumberingPlacement { get; set; }

        /// <summary>
        /// Numbering style.
        /// </summary>
        public NumberingStyle? NumberingStyle { get; set; }

        /// <summary>
        /// Playlist description.
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        /// Whether playlist should be public.
        /// </summary>
        public bool IsSecret { get; set; }
    }
}
