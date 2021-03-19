using Microsoft.AspNetCore.SignalR;
using Sortify.Contracts.Models;
using Sortify.Hubs;
using Sortify.Services.Interfaces;
using System;
using System.Threading.Tasks;

namespace Sortify.Helpers
{
    public class TaskManager
    {
        const float MaxProgressValue = 100f;

        private readonly IConnectionService connectionService;
        private readonly IHubContext<TaskHub> taskHub;
        private readonly string connectionId;

        private bool preventCancellation;

        private readonly float taskWeight;
        private float taskProgress;

        public float ProgressMultiplier { get; set; } = 1f;

        public TaskManager(IConnectionService connectionService, IHubContext<TaskHub> taskHub, string connectionId, float taskWeight)
        {
            this.connectionService = connectionService;
            this.taskHub = taskHub;
            this.connectionId = connectionId;
            this.taskWeight = taskWeight;
        }

        public async Task ReportProgress(string description, bool complete = false)
        {
            if (!connectionService.ConnectionEstablished(connectionId) && !preventCancellation)
            {
                throw new OperationCanceledException();
            }

            var progress = complete ? MaxProgressValue
                : Math.Clamp((taskProgress += ProgressMultiplier) / taskWeight * 100, 0, MaxProgressValue - 1);
            var progressDetails = new TaskDetails(progress, description);

            await taskHub.Clients.Client(connectionId).SendAsync("progressUpdate", progressDetails);
        }

        public async Task PreventCancellation()
        {
            preventCancellation = true;

            await taskHub.Clients.Client(connectionId).SendAsync("preventCancellation");
        }
    }
}
