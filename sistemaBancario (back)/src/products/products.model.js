'use strict'

const mongoose = require('mongoose')

const productsSchema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true,
        default: 0
    },
    stock: {
        type: Number,
        require: true,
        default: 0
    }
},{
    versionKey: false,
})

module.exports = mongoose.model('Products', productsSchema)