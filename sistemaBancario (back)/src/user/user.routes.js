'use strict'

const userController = require('./user.controller');
const express = require('express');
const api = express.Router();
const { ensureAuth, isAdmin } = require('../services/authenticated');

api.get('/test' ,[ensureAuth], userController.test);
api.get('/getAccounts', [ensureAuth, isAdmin], userController.getAccounts)
api.get('/getAdmins', [ensureAuth, isAdmin], userController.getAdmins)
api.get('/getAccount',[ensureAuth, isAdmin], userController.getAccountById)
api.get('/getAdmin', [ensureAuth, isAdmin], userController.getAdminById)
api.post('/createAccount', [ensureAuth, isAdmin], userController.createAccount);
api.post('/login', userController.login);
api.delete('/delete/:id', [ensureAuth], userController.delete);
api.put('/update/:id', [ensureAuth, isAdmin], userController.update);

module.exports = api;