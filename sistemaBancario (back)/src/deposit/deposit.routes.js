'use strict'

const depositController = require('./deposit.controller');
const express = require('express');
const api = express.Router();
const { ensureAuth, isAdmin } = require('../services/authenticated');

// api.get('/test' ,[ensureAuth], transferController.test);
api.post('/newDeposit', [ensureAuth], depositController.newDeposit);
api.put('/revertirD/:id', [ensureAuth], depositController.revertir);
api.get('/getD', [ensureAuth], depositController.getDeposits);
// api.get('/getTransfersById/:id', [ensureAuth], transferController.getTransfersById);

module.exports = api;