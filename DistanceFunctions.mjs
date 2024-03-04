class DistanceFunctions {

    constructor() {}

    setClosestCustomerForEveryWarehouse(customers, warehouses) {
        let closestWarehouse = {}

        for (let customer of customers) {
            let closestDist = Infinity
            for (let warehouse of warehouses) {
                const currentDistance = this.distance(customer.getCoordinate().x, warehouse.getCoordinate().x, 
                                                        customer.getCoordinate().y, warehouse.getCoordinate().y)

                if (currentDistance < closestDist) {
                    closestDist = currentDistance
                    closestWarehouse = warehouse
                }
                customer.setNearestWearhouses(currentDistance, warehouse)
            }
            closestWarehouse.addCustomer(closestDist, customer)
        }
    }

    distance(x1, x2, y1, y2) { // x1, x2
        if (arguments.length === 2) {
            return Math.sqrt(((x1.getCoordinate().x - x2.getCoordinate().x) ** 2) + ((x1.getCoordinate().y - x2.getCoordinate().y) ** 2))
        }
        return Math.sqrt(((x2 - x1) ** 2) + ((y2 - y1) ** 2))
    }

    longestDistance(customers, warehouses) {
        let distances = this.allMinimumDistances(customers, warehouses)
        return Math.max(...distances);
    }
    
    allMinimumDistances(customers, warehouses) {
        let allDistances = [];
    
        for (let customer of customers) {
            let minDistance = Infinity;
            
            for (let warehouse of warehouses) {
                let distanceToWarehouse = this.distance(customer.coordinate.x, warehouse.coordinate.x,
                                                  customer.coordinate.y, warehouse.coordinate.y);
                minDistance = Math.min(minDistance, distanceToWarehouse);
            }
            allDistances.push(minDistance);
        }
        return allDistances;
    }
}

export default DistanceFunctions