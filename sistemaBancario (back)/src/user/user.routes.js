'use strict'

const userController = require('./user.controller');
const express = require('express');
const api = express.Router();
const { ensureAuth, isAdmin } = require('../services/authenticated');

api.get('/test' ,[ensureAuth], userController.test);
api.get('/getAccounts', userController.getAccounts)
api.get('/getAdmins', [ensureAuth, isAdmin], userController.getAdmins)
api.get('/getAccount/:id',[ensureAuth, isAdmin], userController.getAccountById)
api.get('/getAdmin', [ensureAuth, isAdmin], userController.getAdminById)
api.post('/createAccount', [ensureAuth, isAdmin], userController.createAccount);
api.post('/login', userController.login);
api.post('/get', userController.get);
api.delete('/delete/:id', [ensureAuth, isAdmin], userController.delete);
api.get('/getProfile', [ensureAuth], userController.getProfile);
api.put('/updateuser/:id', userController.update)
api.put('/updatePassword', [ensureAuth], userController.updatePassword);
module.exports = api;