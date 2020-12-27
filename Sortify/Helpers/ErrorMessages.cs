namespace Sortify.Helpers
{
    public static class ErrorMessages
    {
        public static string MissingParemeters { get => "One or more parameters are missing in the request."; }

        public static string RequestCancelled { get => "Request has been cancelled."; }

        public static string SessionExpired { get => "Your session has expired. Please log in again."; }

        public static string UnexpectedError { get => "Something went wrong. Please try again later."; }

        public static string PlaylistTooBig(int maxPlaylistSize) => $"One of the created playlists exceeds the limit of {maxPlaylistSize} tracks allowed." +
                                                                    $"\nTry splitting into more playlists.";

        public static string TooManyPlaylists(int maxPlaylists) => $"Created playlists exceed the limit of {maxPlaylists} allowed." +
                                                                   $"\nTry splitting into bigger playlists.";
    }
}
