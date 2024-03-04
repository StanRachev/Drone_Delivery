class Minutes {

    constructor(program, real) {
        this._program = program
        this._real = real
    }

    getProgramMin() {
        return this._program
    }
    
    getRealMs() {
        return this._real
    }
}

export default Minutes