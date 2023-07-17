'use strict'

const express = require('express');
const api = express.Router();
const cambiosController = require('./cambios.controller');

api.post('/dolar', cambiosController.cambioDolar);
api.post('/euro', cambiosController.cambioEuro);
api.post('/yen', cambiosController.cambioYen);
api.post('/libra', cambiosController.cambioLibra);
api.post('/mxn', cambiosController.cambioMxn);

module.exports = api;