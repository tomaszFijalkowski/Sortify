using Microsoft.AspNetCore.SignalR;
using Sortify.Services.Interfaces;
using System;
using System.Threading.Tasks;

namespace Sortify.Hubs
{
    public class TaskHub : Hub
    {
        private readonly IConnectionService connectionService;

        public TaskHub(IConnectionService connectionService)
        {
            this.connectionService = connectionService;
        }

        public string GetConnectionId()
        {
            return Context.ConnectionId;
        }

        public override Task OnConnectedAsync()
        {
            connectionService.AddConnection(Context.ConnectionId);
            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception exception)
        {
            connectionService.RemoveConnection(Context.ConnectionId);
            return base.OnDisconnectedAsync(exception);
        }
    }
}
