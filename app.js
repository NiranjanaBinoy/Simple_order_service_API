const http = require('http');

const express = require('express');

const inventoryRouter = require('./routes/inventory.router')
const orderRouter = require('./routes/order.router');

const app = express();

app.use(express.json())

app.use('/inventories', inventoryRouter)
app.use('/orders', orderRouter)


//app.listen(port)
module.exports = app
