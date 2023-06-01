'use strict'

const mongoose = require('mongoose');

const favoriteSchema = mongoose.Schema({
    apodo:{
        type: String,
        required: true,
        unique: true
    }, 
    noCuenta:{
        type: String,
        required: true
    },
    DPI:{
        type: Number,
        required: true
    },
    idNoCuenta:{
        type: Number,
        required: true
    },
    user: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true
        }
      ],
},
{
    versionKey:false 
});

module.exports = mongoose.model('Favorite', favoriteSchema);