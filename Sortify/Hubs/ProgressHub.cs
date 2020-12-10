using Microsoft.AspNetCore.SignalR;

namespace Sortify.Hubs
{
    public class ProgressHub : Hub
    {
        public string GetConnectionId()
        {
            return Context.ConnectionId;
        }
    }
}
