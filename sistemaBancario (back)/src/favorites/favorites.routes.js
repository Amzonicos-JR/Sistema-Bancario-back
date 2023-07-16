'use strict'

const express = require('express');
const api = express.Router();
const favoriteController = require('./favorites.controller');
const { ensureAuth } = require('../services/authenticated')


//Rutas Privadas 
api.get('/test', favoriteController.test)
api.post('/add', [ensureAuth],favoriteController.addFavorite)
api.get('/get', [ensureAuth],favoriteController.get)
api.get('/getById/:id',[ensureAuth], favoriteController.getById);
api.put('/update/:id',[ensureAuth], favoriteController.updateFavorite)
api.delete('/delete/:id', [ensureAuth],favoriteController.deleteFavorite);
// api.post('/transferF/:id', [ensureAuth], favoriteController.transferF);

module.exports = api;