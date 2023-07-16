'use strict'

const transferController = require('./transfer.controller');
const express = require('express');
const api = express.Router();
const { ensureAuth, isAdmin } = require('../services/authenticated');

api.get('/test' ,[ensureAuth], transferController.test);
api.post('/newTransfer', [ensureAuth], transferController.newTransfer);
api.put('/revertirT/:id', transferController.revertir);
api.get('/getTransfers', [ensureAuth], transferController.getTransfers);
api.get('/getTransfersById', [ensureAuth], transferController.getTransfersById);
api.post('/transferF/:id', [ensureAuth], transferController.transferFast);

module.exports = api;