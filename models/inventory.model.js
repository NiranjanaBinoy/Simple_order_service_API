const db = require('../util/database')

module.exports = class Inventory{
    constructor(id, name, description, price, quantity){
        this.inventoryItemId = id;
        this.inventoryItemName = name;
        this.inventoryItemDescription = description;
        this.inventoryItemPrice = price;
        this.inventoryItemQuantity = quantity;
    }

    save(){
        return db.execute(
            'INSERT INTO inventory(inventory_item_name, inventory_item_description, inventory_item_price, inventory_item_quantity) VALUES (?, ?,?,?);',
            [this.inventoryItemName, this.inventoryItemDescription, this.inventoryItemPrice, this.inventoryItemQuantity]
        );
    }
    update(){
        return db.query(
            'UPDATE inventory SET inventory_item_name= ?, inventory_item_description= ?, inventory_item_price= ?, inventory_item_quantity = ? WHERE inventory_item_id = ?;',
            [this.inventoryItemName, this.inventoryItemDescription, this.inventoryItemPrice, this.inventoryItemQuantity, this.inventoryItemId]
        );
    }
    static delete(id){
        return db.execute(
            'DElETE FROM inventory WHERE inventory_item_id = ?;',
            [id]
        )
    }
    static fetchAll(){
        return db.execute('SELECT * FROM inventory;');
    }

    static fetchByID(id){
        return db.execute('SELECT * FROM inventory WHERE inventory_item_id = ?',[id])
    }

    static fetchByNames(names){
        return db.query('SELECT * FROM inventory WHERE inventory_item_name in (?)',[names])
    }

}