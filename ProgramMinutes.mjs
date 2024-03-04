class ProgramMinutes {

    constructor(poweredOn, minutes) {
        this._poweredOn = poweredOn
        this._minutes = minutes
    }

    isRealLife() {
        return this.getPoweredOn()
    }
    
    getPoweredOn() {
        return this._poweredOn
    }

    getMinutes() {
        return this._minutes
    }
}

export default ProgramMinutes