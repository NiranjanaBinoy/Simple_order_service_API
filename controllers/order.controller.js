const Inventory = require('../models/inventory.model')
const Order = require('../models/order.model');
const OrderInventory = require('../models/orderinventory.model');

/**
 * Controller funtion to add new order
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const postOrder = (req, res, next) =>{
    const customerEmail = req.body.customerEmail
    const orderStatus = 'new'
    const orderInventoryList = req.body.orderInventoryList
    let inventoryList = null
    const itemJSON = {}

    for (let orderInventory of orderInventoryList){
        itemJSON[orderInventory['itemName']] = orderInventory['quantity']
    }

    Inventory
    .fetchByNames(Object.keys(itemJSON))
    .then(inventories =>{
        if(inventories[0].length > 0){
            inventoryList = inventories[0];
            for(let item of inventories[0]){
                if(itemJSON[item['inventory_item_name']] > item['inventory_item_quantity']){
                    res.json({message: "Order Cannot be placed due to insufficent inventory"})
                }
            }
            const order = new Order(null, customerEmail, orderStatus)
            return order.save()
        }
    })
    .then(newOrder =>{
        const orderInventoryList = []
        for( let item of inventoryList){
             orderInventoryList.push([newOrder[0].insertId,item['inventory_item_id'], itemJSON[item['inventory_item_name']]])
             let  newQuantity = item['inventory_item_quantity'] - itemJSON[item['inventory_item_name']]
             let tempInventory = new Inventory(
                item['inventory_item_id'], 
                item['inventory_item_name'],
                item['inventory_item_description'], 
                item['inventory_item_price'], 
                newQuantity)
            tempInventory.update()
        }
        return OrderInventory.save(orderInventoryList)
    })
    .then(updated =>{
        res.json({'message': 'Order created Successfully'})
    })
    .catch(err=>{
        res.send(err)
    })
};
/**
 * Controller funtion to get order list
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const getOrderList = (req, res, next) =>{
       Order
        .fetchAll()
        .then(ordersList=>{
            //res.json(ordersList[0])
            resultsJSON = {}
            if(ordersList[0].length >0){
                ordersList[0].forEach(item => {
                 let result = {}
                 if(item['order_id'] in resultsJSON){
                    result = resultsJSON[item['order_id']]
                 }else{
                    result['order_id'] = item['order_id']
                    result['order_customer_mail'] = item['order_customer_mail']
                    result['order_status'] = item['order_status']
                    result['inventory_details'] = []
                 }
                 let inventory = {}
                 inventory['inventory_id'] = item['inventory_id']
                 inventory['inventory_item_name'] = item['inventory_item_name']
                 inventory['inventory_item_description'] = item['inventory_item_description']
                 inventory['inventory_item_price'] = item['inventory_item_price']
                 inventory['order_quantity'] = item['order_quantity']
                 result['inventory_details'].push(inventory)
                 resultsJSON[item['order_id']] = result
             });
             res.json(resultsJSON)
            }else{
                res.send('No active item')
            }
        })
};
/**
 * Controller funtion to get single order details
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const getOrder = (req, res, next) =>{
    const orderId = req.params.orderId
    Order
       .fetchByID(orderId)
       .then(order =>{
           result = {}
           if(order[0].length >0){
            order[0].forEach(item => {
                result['order_id'] = item['order_id']
                result['order_customer_mail'] = item['order_customer_mail']
                result['order_status'] = item['order_status']
                let inventory = {}
                inventory['inventory_id'] = item['inventory_id']
                inventory['inventory_item_name'] = item['inventory_item_name']
                inventory['inventory_item_description'] = item['inventory_item_description']
                inventory['inventory_item_price'] = item['inventory_item_price']
                inventory['order_quantity'] = item['order_quantity']
                if(!('inventory_details' in result)){
                    result['inventory_details'] = []
                }
                result['inventory_details'].push(inventory)
            });
            res.json(result)
           }else{
               res.send('Order does not exist or Order is cancelled')
           }
            
       }).catch(err =>{
           res.send(err)
       })

};
/**
 * Controller funtion to update the order details
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const updateOrder = (req, res, next) =>{
    const orderId = req.params.orderId;
    const customerEmail = req.body.customerEmail
    const orderStatus = req.body.orderStatus?req.body.orderStatus:'updated'
    const orderInventoryList = req.body.orderInventoryList 
    itemJSON = {}
    for (let orderInventory of orderInventoryList){
        itemJSON[orderInventory['itemName']] = orderInventory['quantity']
    }
    // checking if the order exists
    Order
    .fetchByID(orderId)
    .then(order =>{
        if(order[0].length <= 0){
            res.send('Order does not exist or Order is in cancelled state')
        }
        if(order[0][0]['order_status'] == 'delivered'){
            res.send('Order is already dispatched and cannot be updated')
        }
        const updateOrder =  new Order(orderId, customerEmail, orderStatus) //creating an order instance with new values
        updateOrder.update()
        //if the order new status is not delivered the order_inventory table will be updated
        if(orderStatus !== 'delivered'){
            for(let orderItem of order[0]) {
                // for teh orderitems without any changes updation will be skipped
                if(itemJSON[orderItem['inventory_item_name']] == orderItem['order_quantity']){
                    continue
                }
                //if the new qunatity is higher that existing quantity
                if(itemJSON[orderItem['inventory_item_name']] > orderItem['order_quantity']){
                    let changeInQuantity = itemJSON[orderItem['inventory_item_name']] - orderItem['order_quantity']
                    if(orderItem['inventory_item_quantity'] > changeInQuantity){
                        //update the order_inventory table with new value
                        let updateOrderItem = new OrderInventory(orderItem['order_inventory_id'], orderId, orderItem['inventory_id'], itemJSON[orderItem['inventory_item_name']])
                        updateOrderItem.update()
                                
                        //Reduce the value from teh inventory if the there is suffucient load available
                        let updatedQuantity = orderItem['inventory_item_quantity'] - changeInQuantity;
                        const updateInventory = new Inventory(orderItem['inventory_id'], orderItem['inventory_item_name'], orderItem['inventory_item_description'], orderItem['inventory_item_price'], updatedQuantity)
                        updateInventory.update()
                    }else{
                        message.push('Quantity cannot be updated for '+orderItem['inventory_item_name'])
                    }
                }else{
                    //the case when the updated quantity is lesser than the existing quantity
                    let changeInQuantity = orderItem['order_quantity'] - itemJSON[orderItem['inventory_item_name']];
                    let updateOrderItem = new OrderInventory(orderItem['order_inventory_id'], orderId, orderItem['inventory_id'], itemJSON[orderItem['inventory_item_name']])
                    updateOrderItem.update()
                    let updatedQuantity = orderItem['inventory_item_quantity'] + changeInQuantity;
                    const updateInventory = new Inventory(orderItem['inventory_id'], orderItem['inventory_item_name'], orderItem['inventory_item_description'], orderItem['inventory_item_price'], updatedQuantity)
                    updateInventory.update()   
                }
            }
            res.send('Order Updated!!!')
        }else{
            res.send('Order delivered!!!')
        }
        
    })
    .catch(err =>{
        res.send(err)
    })

};
/**
 * Controller funtion to delete order, in our case we are considereing delete as a cancelled order 
 * so we will eb running an update query with cancelled status
 * @param {*} res 
 * @param {*} next 
 */
const deleteOrder = (req, res, next)=>{
    const orderId = req.params.orderId;
    Order.fetchByID(orderId)
         .then(fetched=>{
            if(fetched[0].length <= 0){
                res.send('Order does not exist or Order is in cancelled state')
            }
            // a delivered item cannot be cancelled
            if(fetched[0][0]['order_status'] != 'delivered'){
                const deleteOrder = new Order(orderId, fetched[0][0]['order_customer_mail'], 'cancelled')
                deleteOrder.update()
                fetched[0].forEach(deletedItem => {
                    const deleteOrderInventory = new OrderInventory(deletedItem['order_inventory_id'], deletedItem['order_id'],deletedItem['inventory_id'],0)
                    deleteOrderInventory.update()
                    let updatedQuantity = deletedItem['inventory_item_quantity']+deletedItem['order_quantity']
                    const deleteInventory = new Inventory(deletedItem['inventory_id'], deletedItem['inventory_item_name'], deletedItem['inventory_item_description'], deletedItem['inventory_item_price'],updatedQuantity)
                    deleteInventory.update()
                });
                res.send('Order Cancelled!!!')
            }else{
                res.send('Order is already dispatched and cannot be cancelled')
            }
         }).catch(err=>{
             res.send(err)
         })
};

module.exports = {
    postOrder:postOrder,
    getOrderList:getOrderList,
    getOrder:getOrder,
    updateOrder:updateOrder,
    deleteOrder:deleteOrder
}