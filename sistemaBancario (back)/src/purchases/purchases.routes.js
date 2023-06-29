'use strict'

const express = require('express');
const api = express.Router();
const purchasesController = require('./purchases.controller');
const {ensureAuth} = require('../services/authenticated')

//Rutas Privadas 
api.post('/buyService', purchasesController.buyService);
api.post('/buyProduct', purchasesController.buyProduct);
api.get('/get/:id', purchasesController.getPurchasesByUser);

module.exports = api;