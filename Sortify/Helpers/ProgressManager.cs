using Microsoft.AspNetCore.SignalR;
using Sortify.Contracts.Models;
using Sortify.Hubs;
using System;
using System.Threading.Tasks;

namespace Sortify.Helpers
{
    public class ProgressManager
    {
        const float MaxProgressValue = 100f;

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

        public async Task ReportProgress(string description, bool complete = false)
        {
            var progress = complete ? MaxProgressValue
                : Math.Clamp((taskProgress += ProgressMultiplier) / taskWeight * 100, 0, MaxProgressValue - 1);
            var progressDetails = new ProgressDetails(progress, description);

            await progressHub.Clients.Client(connectionId).SendAsync("progressUpdate", progressDetails);
        }
    }
}
