'use strict'

const express = require('express');
const api = express.Router();
const serviceBankController = require('./serviceBank.controller');
const {ensureAuth} = require('../services/authenticated')

//Rutas Privadas 
api.post('/add', serviceBankController.addService);
api.get('/get', serviceBankController.getServices);
api.get('/get/:id', serviceBankController.getService);
api.put('/update/:id', serviceBankController.updateService);
api.delete('/delete/:id', serviceBankController.deleteService);

module.exports = api;