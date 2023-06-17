'use strict'

const productsController = require('./products.controller')
const express = require('express')
const api = express.Router()

api.get('/test', productsController.test)
api.post('/add', productsController.add)
api.get('/get', productsController.get)
api.delete('/delete/:id', productsController.delete)
api.put('/update/:id', productsController.update)

module.exports = api