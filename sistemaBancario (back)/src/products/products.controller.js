'use strict'
const Product = require('./products.model')

exports.test = (req, res)=>{
    try{
        return res.send({message: 'hola ( // ^ w ^ //)'})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error to test'})
    }
}

exports.add = async(req, res)=>{
    try{
        let data = req.body
        let total = 0
        total = total+(data.price * data.stock)
        data.total = total
        let product = new Product(data)
        await product.save()
        return res.send({message: 'Product saved successfully', product})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error to saved product'})
    }
}

exports.get = async(req, res)=>{
    try{
        let products = await Product.find()
        return res.status(200).send({products})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error to getting products'})
    }
}

exports.getProduct = async(req, res)=>{
    try{
        let idProduct = req.params.id
        let product = await Product.findOne({_id: idProduct})
        if(!product) return res.status(404).send({message: "Product not found"}) 
        return res.send({product})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: "Error to getting product"})
    }
}

exports.delete = async(req, res)=>{
    try{   
        let idProduct = req.params.id
        let product = await Product.findOneAndDelete({_id: idProduct})
        if(!product) return res.status(404).send({message: 'Product not found'})
        return res.send({message: 'Product deleted successfully'})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error to deleted product'})
    }
}

exports.update = async(req, res)=>{
    try{
        let idProduct = req.params.id
        let data = req.body
        let total = 0
        let product = await Product.findOne({_id: idProduct})
        if(!data.name) data.name = product.name
        if(!data.description) data.description = product.description
        if(!data.price) data.price = product.price
        if(!data.stock) data.stock = product.stock
        total = data.price*data.stock
        data.total = total
        let productUpdate = await Product.findOneAndUpdate(
            {_id: idProduct},
            data,
            {new: true}
        ) 
        if(!product) return res.status(404).send({message: 'Product not found'})
        return res.send({message: 'Product updated soccessfully', productUpdate})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error to updated product'})
    }
}