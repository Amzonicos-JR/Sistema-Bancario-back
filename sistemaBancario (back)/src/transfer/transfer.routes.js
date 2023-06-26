'use strict'

const transferController = require('./transfer.controller');
const express = require('express');
const api = express.Router();
const { ensureAuth, isAdmin } = require('../services/authenticated');

api.get('/test' ,[ensureAuth], transferController.test);
api.post('/newTransfer', [ensureAuth], transferController.newTransfer);
api.put('/revertirT/:id', [ensureAuth], transferController.revertir);
api.get('/getTransfers', [ensureAuth, isAdmin], transferController.getTransfers);
api.get('/getTransfersById/:id', [ensureAuth], transferController.getTransfersById);

module.exports = api;