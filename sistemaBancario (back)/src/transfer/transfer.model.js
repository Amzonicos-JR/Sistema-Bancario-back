'use strict'
const mongoose = require('mongoose');

const transferSchema = mongoose.Schema({
    DPIO: {
        type: String //DPI Ordenante
    },
    DPIB: {
        type: String,
        required: true //DPI Beneficiario
    },
    accountNo: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true,
        default: 0
    },
    date: {
        type: String
    },
    status: {
        type: Number,
        default: 1 //[1 Vigente | 0 No Vigente]
    }
},{
    versionKey: false
});

module.exports = mongoose.model('Transfer', transferSchema);