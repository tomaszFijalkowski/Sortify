namespace Sortify.Contracts.Models
{
    public class ProgressDetails
    {
        public float Value { get; set; }

        public string Description { get; set; }

        public ProgressDetails(float value)
        {
            Value = value;
        }

        public ProgressDetails(float value, string description)
        {
            Value = value;
            Description = description;
        }
    }
}
