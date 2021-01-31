using System.Collections.Generic;

namespace Sortify.Contracts.Requests.Commands
{
    public class SortPlaylistsCommand : ICommand
    {
        public string AccessToken { get; set; }

        public string ConnectionId { get; set; }

        public int TaskWeight { get; set; }

        public IList<string> PlaylistIds { get; set; }

        public IList<string> SortBy { get; set; }

        public bool SortByAudioFeatures { get; set; }
    }
}
