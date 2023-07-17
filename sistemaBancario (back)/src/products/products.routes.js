'use strict'

const productsController = require('./products.controller')
const express = require('express')
const api = express.Router()
const { ensureAuth } = require('../services/authenticated')

api.get('/test', productsController.test)
api.get('/get', productsController.get)
api.get('/get/:id', productsController.getProduct)
api.get('/gethistory', [ensureAuth], productsController.getHistory)
api.post('/add', productsController.add)
api.put('/update/:id', productsController.update)
api.delete('/delete/:id', productsController.delete)

module.exports = api