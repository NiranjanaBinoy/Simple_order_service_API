const db = require('../util/database')

module.exports = class Order{
    constructor(id, email, status) {
        this.orderId  = id;
        this.orderCustomerEmail = email;
        this.orderStatus = status;
    }
    save(){
        return db.execute(
            'INSERT INTO `order` (order_customer_mail, order_status) VALUES (?,?);', 
            [this.orderCustomerEmail, this.orderStatus]
        );
    }
    update(){
        return db.execute(
            'UPDATE `order` set order_customer_mail = ?, order_status = ? WHERE order_id= ?',
            [this.orderCustomerEmail, this.orderStatus, this.orderId]
        )
    }
    // static delete(orderID){
    //     return db.execute(
    //         'DELETE FROM `order` where order_id=?',
    //         [orderID]
    //     )
    // }
    static fetchAll(){
        return db.execute('SELECT o.order_id, o.order_customer_mail, o.order_status, oi.order_quantity, oi.inventory_id,i.inventory_item_name, i.inventory_item_description, i.inventory_item_price,i.inventory_item_quantity, oi.order_inventory_id FROM `order` AS o INNER JOIN order_inventory AS oi USING (order_id) JOIN inventory AS i ON i.inventory_item_id = oi.inventory_id WHERE oi.order_quantity > 0');
    }

    static fetchByID(id){
        return db.execute('SELECT o.order_id, o.order_customer_mail, o.order_status, oi.order_quantity, oi.inventory_id,i.inventory_item_name, i.inventory_item_description, i.inventory_item_price,i.inventory_item_quantity,oi.order_inventory_id from `order` AS o INNER JOIN order_inventory AS oi USING (order_id) JOIN inventory AS i ON i.inventory_item_id = oi.inventory_id WHERE oi.order_quantity > 0 and o.order_id = ?', [id])
    }
}