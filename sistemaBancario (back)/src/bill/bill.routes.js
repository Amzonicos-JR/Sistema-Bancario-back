'use strict'

const express = require('express')
const api = express.Router()
const billController = require('./bill.controller')

api.get('/get', billController.get)
api.get('/get/:id', billController.getBill)
api.post('/add/:id', billController.add)
api.put('/update/:id', billController.update)

module.exports = api