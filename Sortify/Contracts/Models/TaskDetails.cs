namespace Sortify.Contracts.Models
{
    public class TaskDetails
    {
        public float Progress { get; set; }

        public string Description { get; set; }

        public TaskDetails(float progress)
        {
            Progress = progress;
        }

        public TaskDetails(float progress, string description)
        {
            Progress = progress;
            Description = description;
        }
    }
}
