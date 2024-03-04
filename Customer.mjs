class Customer {

    constructor(id, name, coordinates) {
        this._id = id;
        this._name = name;
        this._coordinate = coordinates;
        this._nearestWarhouses = []
        this._orders = []
    }

    getId() {
        return this._id
    }

    getName() {
        return this._name
    }

    getCoordinate() {
        return this._coordinate
    }

    getNearestWearhouses() {
        return this._nearestWarhouses
    }

    setNearestWearhouses(distanceA, warehouseA) {
        const warehouse = {distance:distanceA, warehouse: warehouseA}
        this._nearestWarhouses.push(warehouse)
        this._nearestWarhouses.sort((a, b) => a.distance - b.distance)
    }

    getOrders() {
        return this._orders
    }

    setOrders(order) {
        this._orders.push(order)
    }
}

export default Customer;