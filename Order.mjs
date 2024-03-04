class Order {

    constructor(customerId, productList) {
        this._customerId = customerId
        this.productList = productList
    }

    getCustomerId() {
        return this._customerId
    }
}

export default Order;