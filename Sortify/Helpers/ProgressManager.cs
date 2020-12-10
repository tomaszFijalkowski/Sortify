using Microsoft.AspNetCore.SignalR;
using Sortify.Contracts.Models;
using Sortify.Hubs;
using System;
using System.Threading.Tasks;

namespace Sortify.Helpers
{
    public class ProgressManager
    {
        private readonly IHubContext<ProgressHub> progressHub;
        private readonly string connectionId;
        private readonly float taskWeight;
        private float taskProgress;

        public float ProgressMultiplier { get; set; } = 1f;

        public ProgressManager(IHubContext<ProgressHub> progressHub, string connectionId, float taskWeight)
        {
            this.progressHub = progressHub;
            this.connectionId = connectionId;
            this.taskWeight = taskWeight;
        }

        public async Task ReportCompletion()
        {
            var progressDetails = new ProgressDetails(100);

            await progressHub.Clients.Client(connectionId).SendAsync("taskComplete", progressDetails);
        }

        public async Task ReportProgress(string description)
        {
            var progress = Math.Clamp((taskProgress += ProgressMultiplier) / taskWeight * 100, 0, 100);
            var progressDetails = new ProgressDetails(progress, description);

            await progressHub.Clients.Client(connectionId).SendAsync("progressUpdate", progressDetails);
        }
    }
}
