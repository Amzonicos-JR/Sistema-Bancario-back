'use strict'
const mongoose = require('mongoose');

const cambiosSchema = mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    amount: {type: Number, required: true},
    cambio: {type: Number, required: true}
});

module.exports = mongoose.model('Cambios', cambiosSchema);