'use strict'
const Service = require('./serviceBank.model');

exports.addService = async(req, res)=>{
    try{
        //Obtener la información a agregar
        let data = req.body;        
        //Guardar
        let service = new Service(data);
        await service.save();
        return res.send({message: 'Service saved sucessfully', service})
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error creating service'});
    }
}

exports.getServices = async(req, res)=>{
    try{
        //Buscar datos
        let services = await Service.find();
        return res.send({message: 'Services found', services: services});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error getting services'});
    }
}

exports.getService = async(req, res)=>{
    try{
        //Obtener el Id del servicio a buscar
        let serviceId = req.params.id;
        //Buscarlo en BD
        let service = await Service.findOne({_id: serviceId});
        //Valido que exista el servicio
        if(!service) return res.status(404).send({message: 'Service not found'});
        //Si existe lo devuelvo
        return res.send({message: 'Service found:', service});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error getting service'});
    }
}

exports.updateService = async(req, res)=>{
    try{
        //obtener el Id del servicio
        let serviceId = req.params.id;
        //obtener la data a actualizar
        let data = req.body;        
        //Actualizar
        let updatedService = await Service.findOneAndUpdate(
            {_id: serviceId},
            data,
            {new: true}
        )
        if(!updatedService) return res.send({message: 'Service not found and not updated'});
        return res.send({message: 'Service updated:', updatedService: updatedService});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error updating service'});
    }
}

exports.deleteService = async(req, res)=>{
    try{
        let idService = req.params.id;
        let deletedService = await Service.findOneAndDelete({_id: idService});
        if(!deletedService) return res.status(404).send({message: 'Error removing service or already deleted'});
        return res.send({message: 'Service deleted sucessfully', deletedService: deletedService});
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error removing service'})
    }
}

/* exports.buyService = async (req, res) => {
    try {
        //Obtener el id del servicio a comprar
        let serviceId = req.params.id;
        //Obtener el DPI del usuario que lo compra
        let dpi = req.user.dpi;
        //Buscar al usuario con su dpi
        let user = await User.findOne({dpi: dpi});
        //Con el usuario encontrado actualizar y descontarle el precio del servicio en su saldo
        let service = await Service.findOne({_id: serviceId});
        if(user.saldo < service.price) return res.status(400).send({message: 'Saldo insuficiente'});
        user.saldo = user.saldo - service.price;
        user.services.push(service);
        await user.save();
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error buying service'})
    }
} */