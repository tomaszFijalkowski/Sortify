using Sortify.Contracts.Enums;
using System.Collections.Generic;

namespace Sortify.Contracts.Requests.Commands
{
    public class CreatePlaylistsCommand : ICommand
    {
        public string AccessToken { get; set; }

        public IList<string> PlaylistIds { get; set; }

        public IList<SortByItem> SortBy { get; set; }

        public bool SortByAudioFeatures { get; set; }

        public int? SplitByTracksNumber { get; set; }

        public int? SplitByPlaylistsNumber { get; set; }

        public bool DontBreak { get; set; }

        public BreakType? BreakType { get; set; }

        public string Name { get; set; }

        public NumberingPlacement? NumberingPlacement { get; set; }

        public NumberingStyle? NumberingStyle { get; set; }

        public string Description { get; set; }

        public bool IsSecret { get; set; }
    }

    public class SortByItem
    {
        public string Name { get; set; }

        public string Order { get; set; }
    }
}
