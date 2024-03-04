import Data from "./Data.mjs";
import DistanceFunctions from "./DistanceFunctions.mjs";
import DroneFunctions from "./DroneFunctions.mjs";

const data = new Data()
const distanceFunctions = new DistanceFunctions()
const droneFunctions = new DroneFunctions()

const dataJson = data.data()

const map = dataJson[0]
const customers = dataJson[1]
const warehouses = dataJson[2]
const orders = dataJson[3]
const products = dataJson[4]

data.checkCustomersWarehousesLocations(map, customers, warehouses)
data.setProductsInWarehouses(warehouses, products)
data.setOrdersInEveryCustomer(customers, orders)
distanceFunctions.setClosestCustomerForEveryWarehouse(customers, warehouses)

let drones = {}
let hasBattery = false

if (dataJson[5] != undefined) {
    drones = dataJson[5]
    drones.sort((a, b) => (a.getCapacityLeft() - b.getCapacityLeft()))
    hasBattery = true
}

let deliveryCompleted = droneFunctions.droneDelivery(warehouses, drones, hasBattery)

let programMinutes = {}

if (dataJson[6] != undefined) {
    programMinutes = dataJson[6]

    let dronesDelivering = dronesDeliveringM(deliveryCompleted)
    let programTime = programMinutes.getMinutes().getProgramMin()
    let realLifeTime = programMinutes.getMinutes().getRealMs()
    droneFunctions.realTimeDelivery(programTime, realLifeTime, dronesDelivering)

} else {
    printResult(deliveryCompleted, hasBattery)
}

function printResult(deliveryCompleted, hasBattery) {
    let allTimes = []
    let allDrones = []

    for (const warehouse of deliveryCompleted) {
        for (const timeRecord of warehouse.getAllDeliveriesTimes()) {
            allTimes.push(timeRecord)
        }
        for (const drone of warehouse.getAvailableDrones()) {
            allDrones.push(drone)
        }
    }
    allTimes.sort((a, b) => b.timeDelivering - a.timeDelivering)
    allDrones.sort((a, b) => b.drone - a.drone)

    console.log("Time needed for all orders to be delivered in 12h day: " + totalDistance(allTimes[0].timeDelivering))
    console.log("Drones needed: " + allDrones.length)

    if (hasBattery) {
        console.log("Drones capacity and consumption:")

        for (const drone of allDrones) {
            console.log("Capacity: " + drone.getCapacity() + ", Consumption: " + drone.getConsumption())
        }
    }
}

function dronesDeliveringM(deliveryCompleted) {

    let allDrones = []

    for (const warehouse of deliveryCompleted) {
        for (const drone of warehouse.getAvailableDrones()) {
            allDrones.push(drone)
        }
    }
    return allDrones
}

function totalDistance(time) {
    const hours = time / 60
    const minutes = time % 60
    return Math.floor(hours) + ":" + Math.floor(minutes) + "h."
}
