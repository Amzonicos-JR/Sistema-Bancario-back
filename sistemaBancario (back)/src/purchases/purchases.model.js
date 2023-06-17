'use strict'
const mongoose = require('mongoose');

const purchasesSchema = mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},    
    service: {type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: false},
    product: {type: mongoose.Schema.Types.ObjectId, ref: 'Products', required: false},
    amount: {type: Number, required: false},
    total: {type: Number, required: true}
});

module.exports = mongoose.model('Purchases', purchasesSchema);