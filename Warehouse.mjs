class Warehouse {

    constructor(coordinates, name) {
        this._coordinate = coordinates
        this._name = name
        this._nearestCustomers = []
        this._products = []
        this._availableDrones = []
        this._allDeliveriesTimes = []
    }

    getCoordinate() {
        return this._coordinate
    }
    
    getName() {
        return this._name
    }

    addCustomer(distanceA, customerA) {
        const customer = {distance:distanceA, customer: customerA}
        this._nearestCustomers.push(customer)
        this._nearestCustomers.sort((a, b) => b[1] - a[1])
    }

    getNearestCustomers() {
        return this._nearestCustomers
    }

    setProducts(products) {
        this._products.push(products)
    }

    getAvailableDrones() {
        return this._availableDrones
    }

    addDrone(drone) {
        this._availableDrones.push(drone)
    }

    getAllDeliveriesTimes() {
        return this._allDeliveriesTimes
    }

    setAllDeliveriesTime(time) {
        this._allDeliveriesTimes.push(time)
    }

    addDeiveryTimeToWarehouse(time) {
        return this.setAllDeliveriesTime(time)
    }
}

export default Warehouse;