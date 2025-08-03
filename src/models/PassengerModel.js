class PassengerModel {
    constructor() {
        this.passengerClients = new Map();
    }

    addClient(clientId, socketData) {
        this.passengerClients.set(clientId, {
            socket: socketData.socket,
            subscribedRoutes: new Set(),
            connectedAt: new Date().toISOString()
        });
    }

    removeClient(clientId) {
        return this.passengerClients.delete(clientId);
    }

    getClient(clientId) {
        return this.passengerClients.get(clientId);
    }

    subscribeToRoute(clientId, routeNo) {
        const client = this.passengerClients.get(clientId);
        if (client) {
            const wasAlreadySubscribed = client.subscribedRoutes.has(routeNo);
            client.subscribedRoutes.add(routeNo);
            return !wasAlreadySubscribed;
        }
        return false;
    }

    unsubscribeFromRoute(clientId, routeNo) {
        const client = this.passengerClients.get(clientId);
        if (client) {
            return client.subscribedRoutes.delete(routeNo);
        }
        return false;
    }

    getSubscribersForRoute(routeNo) {
        const subscribers = [];
        this.passengerClients.forEach((client, clientId) => {
            if (client.subscribedRoutes.has(routeNo)) {
                subscribers.push({ clientId, socket: client.socket });
            }
        });
        return subscribers;
    }

    getAllPassengers() {
        return Array.from(this.passengerClients.entries()).map(([clientId, client]) => ({
            clientId,
            subscribedRoutes: Array.from(client.subscribedRoutes),
            connectedAt: client.connectedAt
        }));
    }

    getClientCount() {
        return this.passengerClients.size;
    }
}

module.exports = new PassengerModel();