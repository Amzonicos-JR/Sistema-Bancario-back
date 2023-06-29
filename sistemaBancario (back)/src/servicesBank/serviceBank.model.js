'use strict'
const mongoose = require('mongoose');

const serviceBankSchema = mongoose.Schema({
    name: { type: String, required: true},
    description: { type: String, required: true},
    price: { type: Number, required: true},    
});

module.exports = mongoose.model('Service', serviceBankSchema);