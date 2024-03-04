import State from "./droneState.mjs"

class Drone {

    constructor(capacity, consumption) {
        this._capacity = parseFloat(this.convertToWatt(capacity))
        this._consumption = parseFloat(this.convertToWatt(consumption))
        this._capacityLeft = this._capacity / this._consumption
        this._battery = this._capacity / this._consumption
        this._timeOfDay = 720
        this._state = new Map()
    }

    convertToWatt(toConvert) {

        if (typeof toConvert === 'string') {
            if (toConvert.includes('k')) {
                return toConvert[0] * 1000
            }
            return toConvert.slice(0, -1);
        }
        return toConvert
    }

    getCapacity() {
        return this._capacity
    }

    getConsumption() {
        return this._consumption
    }

    getCapacityLeft() {
        return this._capacityLeft
    }

    reduceCapacityLeft(capacity) {
        this._capacityLeft -= capacity
        return this._capacityLeft > 0
    }

    setCapacityLeft(capacity) {
        this._capacityLeft = capacity
    }

    getBattery() {
        return this._battery
    }

    getTimeLeft() {
        return this.getTimeOfDay()
    }

    getTimeOfDay() {
        return this._timeOfDay
    }

    reduceTimeLeft(time) {
        return this.setTimeOfDay(time)
    }

    setTimeOfDay(time) {
        this._timeOfDay -= time
        return this._timeOfDay > 0
    }

    getState() {
        return this._state
    }

    setState(time, droneState, location) {
        this._state.set(time, {droneState, location})
    }
}

export default Drone