'use strict'

const mongoose = require('mongoose');

const loanSchema = mongoose.Schema({
    DPI: {type: Number, required: true},
    noCuenta: {type: Number, required: true},
    amount: {type: Number, required: true},
    interestRate: {type: Number, required: true},
    durationMonths: {type: Number, required: true},
    monthlyFee: {type: Number, required: true},
    totalPay: {type: Number, required: true}
});

module.exports = mongoose.model('Loan', loanSchema);