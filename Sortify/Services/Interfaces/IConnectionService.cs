namespace Sortify.Services.Interfaces
{
    public interface IConnectionService
    {
        public bool AddConnection(string connectionId);

        public bool RemoveConnection(string connectionId);

        public bool ConnectionEstablished(string connectionId);
    }
}
