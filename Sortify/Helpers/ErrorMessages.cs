namespace Sortify.Helpers
{
    public static class ErrorMessages
    {
        public static string MissingParemeters { get => "One or more parameters are missing in the request."; }

        public static string RequestCancelled { get => "Request has been cancelled."; }

        public static string SessionExpired { get => "Your\u00A0session\u00A0has\u00A0expired. Please\u00A0log\u00A0in\u00A0again."; }

        public static string UnexpectedError { get => "Something\u00A0went\u00A0wrong. Please\u00A0try\u00A0again\u00A0later."; }

        public static string PlaylistTooBig(int maxPlaylistSize) => $"One of the created playlists exceeds the limit of {maxPlaylistSize} tracks allowed." +
                                                                    $"\nTry splitting into more playlists.";

        public static string TooManyPlaylists(int maxPlaylists) => $"Created playlists exceed the limit of {maxPlaylists} allowed." +
                                                                   $"\nTry splitting into bigger playlists.";
    }
}
