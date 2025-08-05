class RouteModel {
    constructor() {
        this.routeLocations = new Map(); // routeNo -> { drivers: Map(driverId -> locationData), lastUpdate: timestamp }
    }

    addRoute(routeNo) {
        if (!this.routeLocations.has(routeNo)) {
            this.routeLocations.set(routeNo, {
                drivers: new Map(),
                lastUpdate: new Date().toISOString(),
                routeNo: routeNo
            });
            return true;
        }
        return false;
    }

    removeRoute(routeNo) {
        return this.routeLocations.delete(routeNo);
    }

    getRoute(routeNo) {
        return this.routeLocations.get(routeNo);
    }

    getAllRoutes() {
        return Array.from(this.routeLocations.entries()).map(([routeNo, routeData]) => ({
            routeNo,
            activeDrivers: routeData.drivers.size,
            lastUpdate: routeData.lastUpdate,
            drivers: Array.from(routeData.drivers.entries()).map(([driverId, driverData]) => ({
                driverId,
                driverName: driverData.driverName,
                lat: driverData.lat,
                lng: driverData.lng,
                speed: driverData.speed,
                lastSeen: driverData.receivedAt
            }))
        }));
    }

    addDriver(routeNo, driverId, driverData) {
        const routeData = this.routeLocations.get(routeNo);
        if (routeData) {
            const isNewDriver = !routeData.drivers.has(driverId);
            routeData.drivers.set(driverId, driverData);
            routeData.lastUpdate = new Date().toISOString();
            return isNewDriver;
        }
        return false;
    }

    removeDriver(routeNo, driverId) {
        const routeData = this.routeLocations.get(routeNo);
        if (routeData) {
            const removed = routeData.drivers.delete(driverId);
            if (routeData.drivers.size === 0) {
                this.removeRoute(routeNo);
                return { removed, routeEmpty: true };
            }
            return { removed, routeEmpty: false };
        }
        return { removed: false, routeEmpty: false };
    }

    getActiveRoutes() {
        return Array.from(this.routeLocations.keys());
    }

    getRouteCount() {
        return this.routeLocations.size;
    }
}

export default new RouteModel();