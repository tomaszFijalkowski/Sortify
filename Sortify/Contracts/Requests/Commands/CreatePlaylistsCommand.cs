using Sortify.Contracts.Enums;
using System.Collections.Generic;

namespace Sortify.Contracts.Requests.Commands
{
    public class CreatePlaylistsCommand : ICommand
    {
        public string AccessToken { get; set; }

        public string ConnectionId { get; set; }

        public int TaskWeight { get; set; }

        public IList<string> PlaylistIds { get; set; }

        public IList<string> SortBy { get; set; }

        public bool SortByAudioFeatures { get; set; }

        public int? SplitByTracksNumber { get; set; }

        public int? SplitByPlaylistsNumber { get; set; }

        public bool SmartSplit { get; set; }

        public SmartSplitType? SmartSplitType { get; set; }

        public string Name { get; set; }

        public NumberingPlacement? NumberingPlacement { get; set; }

        public NumberingStyle? NumberingStyle { get; set; }

        public string Description { get; set; }

        public bool IsSecret { get; set; }
    }
}
