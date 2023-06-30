'use strict'

const express = require('express');
const api = express.Router();
const loanController = require('./loan.controller');
const {ensureAuth} = require('../services/authenticated')

//Rutas Privadas 
api.post('/add', loanController.addLoan);
api.get('/get', loanController.getLoans);
api.get('/getLoan', loanController.getLoanByUser);
api.get('/getLoansById', ensureAuth, loanController.getLoanbyId)

module.exports = api;