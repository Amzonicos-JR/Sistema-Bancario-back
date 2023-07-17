'use strict'
const Cambios = require('./cambios.model')
const User = require('../user/user.model')

exports.cambioDolar = async (req, res) => {
    try {
        let data = req.body
        let userId = data.user;
        let user = await User.findOne({ _id: userId });        
        data.amount = user.balance;
        data.cambio = data.amount / 7.84;        
        return res.send({message: 'Your balance could be: $ '+ data.cambio})
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error cambiando' })
    }
}

exports.cambioEuro = async (req, res) => {
    try {
        let data = req.body
        let userId = data.user;
        let user = await User.findOne({ _id: userId });        
        data.amount = user.balance;
        data.cambio = data.amount / 8.80;
        return res.send({message: 'Your balance could be: € '+ data.cambio})
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error cambiando' })
    }
}

exports.cambioYen = async (req, res) => {
    try {
        let data = req.body
        let userId = data.user;
        let user = await User.findOne({ _id: userId });        
        data.amount = user.balance;
        data.cambio = data.amount * 17.67;
        return res.send({message: 'Your balance could be: ¥ '+ data.cambio})
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error cambiando' })
    }
}

exports.cambioLibra = async (req, res) => {
    try {
        let data = req.body
        let userId = data.user;
        let user = await User.findOne({ _id: userId });        
        data.amount = user.balance;
        data.cambio = data.amount * 0.097;
        return res.send({message: 'Your balance could be: £ '+ data.cambio})
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error cambiando' })
    }
}

exports.cambioMxn = async (req, res) => {
    try {
        let data = req.body
        let userId = data.user;
        let user = await User.findOne({ _id: userId });        
        data.amount = user.balance;
        data.cambio = data.amount * 2.14;
        return res.send({message: 'Your balance could be: $ '+ data.cambio})
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error cambiando' })
    }
}