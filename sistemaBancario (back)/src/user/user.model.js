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
    password:{
        type: String,
        required: true
    },
    noCuenta:{
        type: Number
    },
    email: {
        type: String,
        required: true
    },
    DPI:{
        type: String,
        required: true
    },
    direction: {
        type: String,
        required: true
    },
    ingresosMensuales: {
        type: Number
    },
    balance:{
        type: Number
    },
    movimientos:{
        type: String
    },
    role: {
        type: String,
        required: true,
        uppercase: true
    }
});

module.exports = mongoose.model('User', userSchema);