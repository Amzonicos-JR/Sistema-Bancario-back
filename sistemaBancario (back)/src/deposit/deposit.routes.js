'use strict'

const depositController = require('./deposit.controller');
const express = require('express');
const api = express.Router();
const { ensureAuth, isAdmin } = require('../services/authenticated');

// api.get('/test' ,[ensureAuth], transferController.test);
api.post('/newDeposit', [ensureAuth], depositController.newDeposit);
api.put('/revertirD/:id', depositController.revertir);
api.get('/getD', [ensureAuth], depositController.getDeposits);
api.get('/getTransfersById', [ensureAuth], depositController.getDepositbyId);

module.exports = api;