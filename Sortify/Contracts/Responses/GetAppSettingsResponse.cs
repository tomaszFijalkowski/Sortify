using Sortify.Contracts.Requests.Queries;

namespace Sortify.Contracts.Responses
{
    public class GetAppSettingsResponse : IResponse<GetAppSettingsQuery>
    {
        public string LoginUrl { get; set; }

        public string RedirectUri { get; set; }

        public string ClientId { get; set; }

        public string ClientScope { get; set; }
    }
}
