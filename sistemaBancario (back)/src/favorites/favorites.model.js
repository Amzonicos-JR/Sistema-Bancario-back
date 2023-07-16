'use strict'

const mongoose = require('mongoose');

const favoriteSchema = mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true

    },
    apodo:{
        type: String,
        required: true,
    }, 
    DPI:{
        type: String,
        required: true
    },
    noCuenta:{
        type: String,
        required: true
    }
},
{
    versionKey:false 
});

module.exports = mongoose.model('Favorite', favoriteSchema);