'use strict'

const productsController = require('./products.controller')
const express = require('express')
const api = express.Router()

api.get('/test', productsController.test)
api.get('/get', productsController.get)
api.get('/get/:id', productsController.getProduct)
api.post('/add', productsController.add)
api.put('/update/:id', productsController.update)
api.delete('/delete/:id', productsController.delete)

module.exports = api