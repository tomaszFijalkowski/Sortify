using Sortify.Services.Interfaces;
using System.Collections.Concurrent;

namespace Sortify.Services
{
    /// <summary>
    /// A service that keeps current client connections to the hub.
    /// This implementation requires sticky session when using more than one server instance
    /// </summary>
    public class ConnectionService : IConnectionService
    {
        private ConcurrentDictionary<string, byte> Connections { get; } = new ConcurrentDictionary<string, byte>();

        public bool AddConnection(string connectionId)
        {
            return Connections.TryAdd(connectionId, byte.MinValue);
        }

        public bool RemoveConnection(string connectionId)
        {
            return Connections.TryRemove(connectionId, out _);
        }

        public bool ConnectionEstablished(string connectionId)
        {
            return Connections.TryGetValue(connectionId, out _);
        }
    }
}
