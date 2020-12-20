namespace Sortify.Contracts.Models
{
    public class ProgressDetails
    {
        public float Progress { get; set; }

        public string Description { get; set; }

        public ProgressDetails(float progress)
        {
            Progress = progress;
        }

        public ProgressDetails(float progress, string description)
        {
            Progress = progress;
            Description = description;
        }
    }
}
