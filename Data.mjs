import { readFileSync } from 'fs';
import Coordinate from "./Coordinate.mjs";
import Map from './Map.mjs';
import Products from './Products.mjs';
import Customer from "./Customer.mjs";
import Warehouse from "./Warehouse.mjs";
import Order from './Order.mjs';
import Drone from './Drone.mjs';
import Minutes from './Minutes.mjs';
import ProgramMinutes from "./programMinutes.mjs";

class Data {

constructor() {}

data() {
    try{
        const jsonData = readFileSync('data.json', 'utf8')
        const rawData = JSON.parse(jsonData)
        let returnData = [];

        const map = new Map(new Coordinate(rawData['map-top-right-coordinate'].x, rawData['map-top-right-coordinate'].y))
        const products = rawData.products.map(products => new Products(products))
        const customers = rawData.customers.map(customers => new Customer(customers.id, customers.name, new Coordinate(customers.coordinates.x, customers.coordinates.y)))
        const warehouses = rawData.warehouses.map(warehouse => new Warehouse(new Coordinate(warehouse.x, warehouse.y), (warehouse.name || warehouse.Name)))
        const orders = rawData.orders.map(orders => new Order(orders.customerId, orders.productList))
        returnData.push(map, customers, warehouses, orders, products)

        if (rawData.typesOfDrones != undefined) {
            const droneTypes = rawData.typesOfDrones.map(drone => new Drone(drone.capacity, drone.consumption))
            returnData.push(droneTypes)
        }
        if (rawData.output != undefined) {
            const output = new ProgramMinutes(rawData.output.poweredOn, new Minutes(rawData.output.minutes.program, rawData.output.minutes.real))
            returnData.push(output)
        }
        return returnData

    } catch (error) {
        console.error(error)
    }   
}

checkCustomersWarehousesLocations(map, customers, warehouses) {

    for (const warehouse of warehouses) {
        if (warehouse.getCoordinate().x > map.getCoordinates().x || warehouse.getCoordinate().y > map.getCoordinates().y) {
            throw new Error('Warehouse location is escaping the map');
        }
    }

    for (const customer of customers) {
        if (customer.getCoordinate().x > map.getCoordinates().x || customer.getCoordinate().y > map.getCoordinates().y) {
            throw new Error('Customer location is escaping the map');
        }
    }
}

setOrdersInEveryCustomer(customers, orders) {
    
    for (let customer of customers) {
        for(let order of orders) {
            if (order.getCustomerId() == customer.getId()) {
                customer.setOrders(order.productList)
            }
        }
    }
}

setProductsInWarehouses(warehouses, products) {

    for (const warehouse of warehouses) {
        warehouse.setProducts(products)
    }
}
}

export default Data 