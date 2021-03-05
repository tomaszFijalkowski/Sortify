using Sortify.Contracts.Requests.Queries;
using Sortify.Contracts.Responses.Base;

namespace Sortify.Contracts.Responses
{
    /// <summary>
    /// Response with application settings required by ClientApp.
    /// </summary>
    public class GetAppSettingsResponse : IResponse<GetAppSettingsQuery>
    {
        public AppSettings AppSettings { get; set; }
    }

    public class AppSettings
    {
        /// <summary>
        /// The auth server's endpoint that allows to log the user in when using implicit flow.
        /// </summary>
        public string LoginUrl { get; set; }

        /// <summary>
        /// The client's redirect URI as registered with the auth server.
        /// </summary>
        public string RedirectUri { get; set; }

        /// <summary>
        /// The redirect URI used when doing silent refresh.
        /// </summary>
        public string SilentRefreshRedirectUri { get; set; }

        /// <summary>
        /// The client's id as registered with the auth server.
        /// </summary>
        public string ClientId { get; set; }

        /// <summary>
        /// The requested scopes.
        /// </summary>
        public string ClientScope { get; set; }

        /// <summary>
        /// The URL used to connect with ProgressHub.
        /// </summary>
        public string ProgressHubUrl { get; set; }
    }
}
