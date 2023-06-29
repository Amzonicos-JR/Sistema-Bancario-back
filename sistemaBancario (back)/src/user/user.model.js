'use strict'
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    noCuenta: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    DPI: {
        type: String,
        required: true
    },
    direction: {
        type: String,
        required: true
    },
    ingresosMensuales: {
        type: String
    },
    balance: {
        type: Number
    },
    movimientos: {
        type: Number
    },
    role: {
        type: String,
        required: true,
        uppercase: true
    }
}, {
    versionKey: false
});

module.exports = mongoose.model('User', userSchema);