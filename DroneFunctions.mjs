import DistanceFunctions from "./DistanceFunctions.mjs";
import Drone from "./Drone.mjs";
import State from "./droneState.mjs";

const timeToLoadTheOrder = 5
const batteryRecharde = 20
const timeOfDay = 720
let isDelivery = true

const distanceFunctions = new DistanceFunctions

class DroneFunctions {

    constructor() {}

    realTimeDelivery(totalProgramTime, realLifeMs, drones) {

        const start = new Date().getTime()
        let currentProgramTime = 0
        let cntr = 0

        while (currentProgramTime < totalProgramTime) {

            const realTimePassed = new Date().getTime() - start
            currentProgramTime = (totalProgramTime / realLifeMs) * realTimePassed          
            
            // if (drones[0].getState().get(currentProgramTime) != undefined) {
            //     console.log(drones[0].getState().get(currentProgramTime))
            // }
            if (drones[1].getState().get(currentProgramTime) != undefined) {
                console.log("Drone 2: ")
                console.log(drones[1].getState().get(currentProgramTime))
            }
            if (drones[2].getState().get(currentProgramTime) != undefined) {
                console.log("Drone 3: ")
                console.log(drones[2].getState().get(currentProgramTime))
            }
        }
    }

    droneDelivery(warehouses, drones, hasBattery) {

        let drone = {}

        for (const [indexW, warehouse] of warehouses.entries()) {
            while(this.hasOrdersW(warehouse)) { 
                for (const [indexC, customer] of warehouse.getNearestCustomers().entries()) {
                    while (this.hasOrdersC(customer)) {

                        drone = this.shouldGetDrone(warehouse, customer, drones, drone, hasBattery)
                        this.updateDrone(warehouse, drone, customer, hasBattery, isDelivery = true) 
                        this.orderRemovedFromCustomer(customer.customer)

                        let lastCustomer = warehouse.getNearestCustomers().length - 1;

                        if (!this.hasOrdersC(customer) && !this.hasOrdersW(warehouse)) {
                            if (this.hasNextWarehouse(warehouses, indexW)) { // there are more warehouses
                                drone = this.sameDroneForNextWarehouseOrNew(warehouses, indexW, drone, customer)                                    
                                break // change warehouse
                            }
                            warehouse.addDeiveryTimeToWarehouse({drone: drone, timeDelivering: (timeOfDay - drone.getTimeLeft())})
                            this.updateDrone(warehouse, drone, customer, hasBattery, isDelivery = false) 
                            return [...warehouses]
                        }
                        this.updateDrone(warehouse, drone, customer, hasBattery, isDelivery = false) 
                    }
                }
            }
        }
        return [warehouses]
    }

    hasOrdersW(warehouse, numbers) {

        if (arguments.length == 1) {
            let cntr = 0

            for(let customer of warehouse.getNearestCustomers()) {
                cntr += customer.customer.getOrders().length
            }
    
            return cntr > 0

        } else {
                for(let customer of warehouse.getNearestCustomers()) {
                numbers += customer.customer.getOrders().length
            }
    
            return numbers
        }
        
    }

    hasOrdersC(customer) {
        return customer.customer.getOrders().length > 0
    }

    shouldGetDrone(warehouse, customer, drones, drone, hasBattery) {
        let droneTemp = new Drone(0, 0)
        let newDroneToAssign = droneTemp

        if (hasBattery) {
            let isNewDrone = true
            const distance = distanceFunctions.distance(customer.customer, warehouse)

            droneTemp = this.findSmallestDrone(drones, distance)

            for (let droneW of warehouse.getAvailableDrones()) { // if Warehouse has this type of drone
                if (droneTemp.getCapacity() == droneW.getCapacity()) { // if yes - use it

                    const isBatteryEmpty = this.isBatteryLeft(droneW.getCapacityLeft(), warehouse, customer.distance)

                    if (this.isThereTimeLeft(droneW.getTimeLeft(), warehouse, customer.distance, isBatteryEmpty)) {
                        if (isBatteryEmpty) {
                            this.droneRechargedBattery(droneW, warehouse)
                        }
                        newDroneToAssign = droneW
                        isNewDrone = false
                        break
                    } else {
                        warehouse.addDeiveryTimeToWarehouse({drone: droneW, timeDelivering: (timeOfDay - droneW.getTimeLeft())})
                    }
                }
            }

            if (isNewDrone) {
                newDroneToAssign = new Drone(droneTemp.getCapacity(), droneTemp.getConsumption())
                warehouse.addDrone(newDroneToAssign) // add new drone to the warehouse
                newDroneToAssign.setState(this.timeElapsed(newDroneToAssign), State.AT_WAREHOUSE, warehouse)
            }
        } else {
            const availableDrones = warehouse.getAvailableDrones();

            if (availableDrones == 0) {
                warehouse.addDrone(newDroneToAssign)
            } else if (availableDrones > 0 && !(this.isThereTimeLeft(timeLeftDrone, warehouse, customer.distance, 1))) {
                const timeLeftDrone = drone.getTimeLeft();

                warehouse.addDeiveryTimeToWarehouse({drone: drone, timeDelivering: (timeOfDay - timeLeftDrone)})
                warehouse.addDrone(newDroneToAssign)
            } else {
                newDroneToAssign = drone
            }
        }
        return newDroneToAssign
    }

    findSmallestDrone(drones, distance) {
        let droneTemp = new Drone(0, 0)

        for (let i = 0; i < drones.length; i++) {
            if (drones[i].getCapacity() - (distance * 2) > 0) {
                droneTemp = drones[i]
                break
            }
        }
        return droneTemp
    }

    isBatteryLeft(time, warehouse, distance) {

        const ordersLeftAtWarehouse = this.hasOrdersW(warehouse, 0)

        if (ordersLeftAtWarehouse == 1) {
            const isTimeLeft = time - distance < 0
            return isTimeLeft
        } else if (ordersLeftAtWarehouse > 1) {
            const isTimeLeft = time - (distance * 2) - batteryRecharde < 0
            return isTimeLeft
        }       
    }

    isThereTimeLeft(time, warehouse, distance, droneBattery) {

        const ordersLeftAtWarehouse = this.hasOrdersW(warehouse, 0)

        if (ordersLeftAtWarehouse == 1) {
            const isTimeLeft = time - distance > 0
            return isTimeLeft
        } else if (ordersLeftAtWarehouse > 1 && !droneBattery) {
            const isTimeLeft = time - (distance * 2) > 0
            return isTimeLeft
        } else if (ordersLeftAtWarehouse > 1 && droneBattery) {
            const isTimeLeft = time - (distance * 2) - batteryRecharde > 0
            return isTimeLeft
        }
    }

    droneRechargedBattery(drone, warehouse) {
        drone.reduceTimeLeft(batteryRecharde)
        drone.setCapacityLeft(drone.getBattery())
        drone.setState(this.timeElapsed(drone), State.CHARGING, warehouse)
    }

    updateDrone(warehouse, drone, customer, hasBattery, isDelivery) {
        if (hasBattery) {
            drone.reduceCapacityLeft(customer.distance)
        }
        if (isDelivery) {
            drone.reduceTimeLeft(timeToLoadTheOrder)
            drone.setState(this.timeElapsed(drone), State.COLLECTING_ORDER, warehouse)
            drone.reduceTimeLeft(customer.distance)
            drone.setState(this.timeElapsed(drone), State.DROPPING_ORDER, customer.customer)
        } else {
            drone.reduceTimeLeft(customer.distance)
            drone.setState(this.timeElapsed(drone), State.AT_WAREHOUSE, warehouse)
        }
        return
    }

    orderRemovedFromCustomer(customer) {
        customer.getOrders().splice(0, 1)
    }

    hasNextWarehouse(warehouses, indexW) {
        return indexW < warehouses.length - 1
    }

    sameDroneForNextWarehouseOrNew(warehouses, indexW, drone, customer) {
        if (this.isThereTimeLeftForTheNextWarehouseOrNewDrone(warehouses, indexW, drone, customer)) {
            const distanceToNextWarehouse = distanceFunctions.distance(customer.customer, warehouses[indexW + 1])
            drone.reduceTimeLeft(distanceToNextWarehouse)
            warehouses[indexW + 1].addDrone(drone)
            warehouses[indexW].getAvailableDrones().pop()     
        } else { // If current drone can't make all orders for next Warehouse, next Warehouse starts with new drone
            warehouses[indexW].addDeiveryTimeToWarehouse({drone: drone, timeDelivering: (timeOfDay - drone.getTimeLeft())})
        } 
        return drone
    }

    // Calculate if current drone can deliver all orders for the next warehouse
    // If not start new drone from the next warehouse
    isThereTimeLeftForTheNextWarehouseOrNewDrone(warehouses, index, drone, customer) {
        let totalDistance = 0
        let totalOrdersNextWarehouse = this.hasOrdersW(warehouses[index + 1], 0)
        let turns = 2

        for (let customer of warehouses[index + 1].getNearestCustomers()) {
            for (let order of customer.customer.getOrders()) {
                if (totalOrdersNextWarehouse == 1 && this.isNextWarehouse(warehouses, index)) { // if last customer && no next warehouse
                    turns = 1
                } else if (customer.customer.getOrders().length > 0) { // if not last customer
                    totalDistance += timeToLoadTheOrder + (customer.distance * turns)
                }
                totalOrdersNextWarehouse--
            }
        }
        const distanceToNextWarehouse = distanceFunctions.distance(customer.customer, warehouses[index + 1])

        return drone.getTimeLeft() - totalDistance - distanceToNextWarehouse > 0
    }

    isNextWarehouse(warehouses, index) {
        return index + 1 == warehouses.length - 1
    }

    timeElapsed(drone) {
        return timeOfDay - drone.getTimeLeft()
    }
}

export default DroneFunctions