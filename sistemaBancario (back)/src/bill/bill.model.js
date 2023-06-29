'use strict'

const mongoose = require('mongoose')

const billSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service'
    },
    date: {
        type: Date,
        require: true
    },
    total: {
        type: Number,
        require: true
    }
},{
    versionKey: false
})

module.exports = mongoose.model('Bill', billSchema)