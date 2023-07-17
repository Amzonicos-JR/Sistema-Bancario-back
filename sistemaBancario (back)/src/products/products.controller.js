'use strict'
const Product = require('./products.model')
const Transfer = require('../transfer/transfer.model')
const Deposit = require('../deposit/deposit.model')
const Loan = require('../loan/loan.model')

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
        let productExist = await Product.findOne({name: data.name})
        if(productExist) return res.status(404).send({message: "Product name already exist"})
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

exports.getHistory = async(req, res)=>{
    try{
        let transfers = await Transfer.find({ DPIO: req.user.DPI, status: 1 });
        let deposits = await Deposit.find({ DPIO: req.user.DPI, status: 1 });
        let loans = await Loan.find({ DPI: req.user.DPI });

        deposits = deposits.map(deposit => {
            const parts = deposit.date.split(/[\/,: ]/);
            const day = parts[0].padStart(2, '0');
            const month = parts[1].padStart(2, '0');
            const year = parts[2];
            const hour = parts[4].padStart(2, '0');
            const minutes = parts[5].padStart(2, '0');
            const seconds = parts[6].padStart(2, '0');
          
            const formattedDate = `${year}/${month}/${day}, ${hour}:${minutes}:${seconds}`;
          
            return {
              ...deposit._doc,
              date: formattedDate
            };
          });

        transfers = transfers.map(transfer => {
            const parts = transfer.date.split(/[\/,: ]/);
            const day = parts[0].padStart(2, '0');
            const month = parts[1].padStart(2, '0');
            const year = parts[2];
            const hour = parts[4].padStart(2, '0');
            const minutes = parts[5].padStart(2, '0');
            const seconds = parts[6].padStart(2, '0');
          
            const formattedDate = `${year}/${month}/${day}, ${hour}:${minutes}:${seconds}`;
          
            return {
              ...transfer._doc,
              date: formattedDate
            };
          });    

        loans = loans.map(loan => {
            const parts = loan.date.split(/[\/,: ]/);
            const day = parts[0].padStart(2, '0');
            const month = parts[1].padStart(2, '0');
            const year = parts[2];
            const hour = parts[4].padStart(2, '0');
            const minutes = parts[5].padStart(2, '0');
            const seconds = parts[6].padStart(2, '0');
          
            const formattedDate = `${year}/${month}/${day}, ${hour}:${minutes}:${seconds}`;
          
            return {
              ...loan._doc,
              date: formattedDate
            };
          });                 

        deposits = deposits.map(deposit => ({
            ...deposit,
            date: parseInt(deposit.date.replace(/[\/,: ]/g, '')),
            color: "#70FF8B",
            type: "Deposit"
          }));

        transfers = transfers.map(transfer => ({
            ...transfer,
            date: parseInt(transfer.date.replace(/[\/,: ]/g, '')),
            color: "#27A4F2",
            type: "Transfer"
          })); 

        loans = loans.map(loan => ({
            ...loan,
            date: parseInt(loan.date.replace(/[\/,: ]/g, '')),
            color: "#F4A020",
            type: "Loan"
        }))

        const history = deposits.concat(transfers, loans);
        history.sort((a, b) => b.date - a.date);

        return res.send({history})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error to getting  history'})
    }
}