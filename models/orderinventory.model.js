const db = require('../util/database')

module.exports = class OrderInventory{
    constructor(orderInventoryID, orderId, inventoryId, quantity){
        this.orderInventoryID = orderInventoryID;
        this.orderId = orderId;
        this.inventoryId = inventoryId;
        this.orderQuantity = quantity;
    }
    static save(orderInventoryList){
        return db.query(
            'INSERT INTO order_inventory(order_id, inventory_id, order_quantity) VALUES ?',
            [orderInventoryList]
        )
    }
    update(){
        return db.execute(
            'UPDATE order_inventory SET order_id = ?, inventory_id = ?, order_quantity = ? WHERE order_inventory_id = ?;',
            [this.orderId, this.inventoryId, this.orderQuantity, this.orderInventoryID]
        )
    }
    static delete(orderId){
        return db.execute(
            'DELETE from order_inventory WHERE order_id = ?',
            [orderId]
        )
    }
}