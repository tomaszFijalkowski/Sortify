namespace Sortify.Contracts.Requests.Queries
{
    public class GetUserDetailsQuery : IQuery
    {
        public string AccessToken { get; set; }
    }
}
