'use strict'

const express = require('express');
const api = express.Router();
const favoriteController = require('./favorites.controller');
const { ensureAuth } = require('../services/authenticated')


//Rutas Privadas 
api.get('/test', favoriteController.test)
api.get('/get', favoriteController.getFavorites)
api.get('/get/:id', favoriteController.getFavorite);
api.post('/add', favoriteController.addFavorite)
api.put('/update/:id', favoriteController.updateFavorite)
api.delete('/delete/:id', favoriteController.deleteFavorite);

module.exports = api;