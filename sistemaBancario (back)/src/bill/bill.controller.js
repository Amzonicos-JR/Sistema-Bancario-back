'use strict'
const Bill = require('./bill.model')
const User = require('../user/user.model')
const Product = require('../products/products.model')
const Service = require('../servicesBank/serviceBank.model')
const infoUser = '-_id -password -DPI -direction -role'
const infoService = '-_id -__v'
const infoProduct = '-_id -total -stock'

exports.get = async(req, res)=>{
    try{
        let bills = await Bill.find()
            .populate('user', infoUser)
            .populate('service', infoService)
            .populate('product', infoProduct)        
        return res.status(200).send({bills})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: "Error to getting bills"})
    }
}

exports.getBill = async(req, res)=>{
    try{
        let idBill = req.params.id
        let bill = await Bill.findOne({_id: idBill})
            .populate('user', infoUser)
            .populate('service', infoService)
            .populate('product', infoProduct)            
        if(!bill) return res.status(404).send({message: "Bill not found"})

        return res.status(200).send({bill})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: "Error to getting bill"})
    }
}

exports.add = async(req, res) =>{
    try{
        let idProductService = req.params.id
        let data = req.body
        let user = await User.findOne({_id: data.user})
        if(!user) return res.status(404).send({message: "User not found"})

        let product = await Product.findOne({_id: idProductService})
        let service = await Service.findOne({_id: idProductService})
        if(!product && !service) return res.status(404).send({message: 'Producto or Servicie not found'})

        data.date = Date.now() 
        if(product){
            let stock = product.stock
            stock = stock - 1
            await Product.findOneAndUpdate({_id: idProductService},{stock: stock})
            data.product = idProductService
            data.total = product.price
        } 

        if(service) {
            
            data.service = idProductService
            data.total = service.price
        }  

        let bill = new Bill(data)    
        await bill.save()
        return res.status(200).send({message: "Saved bill successfully", data})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: "Error to saved bill"})
    }
}

exports.update = async(req, res)=>{
    try{
        let idBill = req.params.id
        let data = req.body
        let bill = await Bill.findOne({_id: idBill})
        if(!bill) return res.status(404).send({message: 'bill not found'})

        let product = await Product.findOne({_id: data.productService})
        let service = await Service.findOne({_id: data.productService})
        if(!product && !service) return res.status(404).send({message: "Product o Service not found"})


        return res.status(200).send({message: "Updated bill successfully"})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: "Error to updated bill"})
    }
}