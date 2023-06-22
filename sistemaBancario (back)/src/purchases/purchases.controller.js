'use strict'
const User = require('../user/user.model');
const Service = require('../servicesBank/serviceBank.model');
const Product = require('../products/products.model');
const Purchases = require('./purchases.model');

exports.buyService = async (req, res) => {
    try {
        let data = req.body;
        //Obtener el id de lo que comprará
        let shopId = req.body.service;
        //Obtener el id de la persona que lo comprará
        let userId = data.user;
        //Buscar al usuario con su id
        let user = await User.findOne({ _id: userId });
        //Verificamos si es un servicio lo que comprará
        let serviceExist = await Service.findOne({ _id: shopId })
        //Con el usuario encontrado actualizar y descontarle el precio del servicio en su saldo
        if (user.balance < serviceExist.price) return res.send({ message: 'Insufficient balance' });
        let newBalance = user.balance - serviceExist.price;
        let fecha = new Date();
        data.date = fecha.toLocaleString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        }).replace('.', ',');
        data.amount = 1;
        //Actualizar el saldo del usuario luego de la compra
        let updatedUser = await User.findOneAndUpdate({ _id: userId }, { balance: newBalance }, { new: true });
        let subtotal = serviceExist.price
        data.total = subtotal;
        let sumMovement = 1;
        let userM = await User.findOneAndUpdate(
            { _id: data.user },
            { $inc: { movimientos: sumMovement } },
            { new: true }
        );
        let purchases = new Purchases(data);
        await purchases.save();
        return res.send({ message: 'Thanks for buying, in "purchases" you can see your invoice' });
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error buying service/product' })
    }
}

exports.buyProduct = async (req, res) => {
    try {
        let data = req.body;
        //Obtener el id de lo que comprará
        let shopId = req.body.product;
        //Obtener el id de la persona que lo comprará
        let userId = data.user;
        //Buscar al usuario con su id
        let user = await User.findOne({ _id: userId });
        let productExist = await Product.findOne({ _id: shopId })
        if (productExist) {
            if (data.amount > productExist.stock) return res.send({ message: 'insufficient stock' })
            let shop = Number(data.amount) * productExist.price
            if (user.balance < shop) return res.send({ message: 'Insufficient balance' });
            let newBalance = user.balance - shop;
            //Actualizar el saldo del usuario luego de la compra
            let updatedUser = await User.findOneAndUpdate({ _id: userId }, { balance: newBalance }, { new: true });
            let newStock = productExist.stock - Number(data.amount)
            let fecha = new Date();
            data.date = fecha.toLocaleString('es-ES', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            }).replace('.', ',');
            //Actualizar el stock del producto
            let updatedProduct = await Product.findOneAndUpdate({ _id: shopId }, { stock: newStock }, { new: true })
            data.total = shop;
            let sumMovement = 1;
            let userM = await User.findOneAndUpdate(
                { _id: data.user },
                { $inc: { movimientos: sumMovement } },
                { new: true }
            );
            let purchases = new Purchases(data);
            await purchases.save();
            return res.send({ message: 'Thanks for buying, in "purchases" you can see your invoice' });
        }
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error buying service/product' })
    }
}

exports.getPurchasesByUser = async (req, res) => {
    try {
        //Obtener el id del usuario
        let userId = req.params.id;
        //Buscar las compras que tiene
        let purchaseList = await Purchases.find({ user: userId }).populate('user').populate('service').populate('product');
        return res.send({ message: 'your invoices', purchaseList })
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error getting invoice' })
    }
}
