const express = require('express')

const inventoryController = require('../controllers/inventory.controller')

const router = express.Router()

router.get('/', inventoryController.getInventoryList)
router.get('/:inventoryId', inventoryController.getInventoryItem)
router.post('/', inventoryController.postInventory)
router.put('/:inventoryId', inventoryController.updateInventoryItem)
router.delete('/:inventoryId', inventoryController.deleteInventoryItem)

module.exports = router;