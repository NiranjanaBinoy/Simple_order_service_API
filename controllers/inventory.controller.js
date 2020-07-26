const Inventory = require('../models/inventory.model')

/**
 * Controller function to add item to inventory
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const postInventory = (req, res, next) =>{
    const inventoryName = req.body.inventoryName; 
    const inventoryDescription = req.body.inventoryDescription
    const inventoryPrice = req.body.inventoryPrice
    const inventoryQuantity = req.body.inventoryQuantity
    
    const inventory = new Inventory(null, inventoryName, inventoryDescription, inventoryPrice, inventoryQuantity)

    inventory
    .save()
    .then(result=>{
        return Inventory.fetchAll()
    })
    .then(inventories=>{
        res.json(inventories[0])
    })
    .catch(err=>{
        res.send(err)
    });
}
/**
 * Controller function to get item list from inventory
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const getInventoryList = (req, res, next) =>{
    Inventory
    .fetchAll()
    .then(inventories =>{
        res.json(inventories[0])
    }).catch(err=>{
        res.send(err)
    })
}
/**
 * Controller function to get item details inventory
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const getInventoryItem = (req, res, next)=>{
    const inventoryId = req.params.inventoryId;
    Inventory
        .fetchByID(inventoryId)
        .then(inventoryItem =>{
            res.json(inventoryItem[0])
        })
        .catch(err=>{
            res.send(err)
        })
}
/**
 * Controller function to update item 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const updateInventoryItem = (req, res, next) =>{
    const inventoryId = req.params.inventoryId;
    const inventoryName = req.body.inventoryName; 
    const inventoryDescription = req.body.inventoryDescription;
    const inventoryPrice = req.body.inventoryPrice;
    const inventoryQuantity = req.body.inventoryQuantity;
    
    const inventory = new Inventory(inventoryId, inventoryName, inventoryDescription, inventoryPrice, inventoryQuantity)

    inventory
     .update()
     .then(updated =>{
         return Inventory.fetchByID(inventoryId)
     }).then(inventoryItem=>{
         res.json(inventoryItem[0])
     })
     .catch(err =>{
         res.send(err)
     })
}
/**
 * Controller function to delete item
 * @param {*} res 
 * @param {*} next 
 */
const deleteInventoryItem = (req, res, next) =>{
    const inventoryId = req.params.inventoryId;
    Inventory
      .delete(inventoryId)
      .then(deleted=>{
          return Inventory.fetchAll()
      }).then(inventories =>{
          res.json(inventories[0])
      })
      .catch(err =>{
          res.send(err)
      })
}

module.exports ={
    postInventory:postInventory,
    getInventoryList:getInventoryList,
    getInventoryItem:getInventoryItem,
    updateInventoryItem:updateInventoryItem,
    deleteInventoryItem:deleteInventoryItem
}