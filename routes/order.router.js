const express = require('express')

const orderRouter = require('../controllers/order.controller')

const router = express.Router()

router.get('/', orderRouter.getOrderList)
router.get('/:orderId', orderRouter.getOrder)
router.post('/', orderRouter.postOrder)
router.put('/:orderId', orderRouter.updateOrder)
router.delete('/:orderId', orderRouter.deleteOrder)

module.exports = router