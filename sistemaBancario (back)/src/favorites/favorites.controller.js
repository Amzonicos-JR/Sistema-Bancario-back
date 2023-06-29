'use strict'

const Favorite = require('./favorites.model')

// Funcion test
exports.test = (req, res) => {
    res.send({ message: 'Test function is running Favorite' });
}

// Add Favorite
exports.addFavorite = async (req, res) => {
    try {
        let data = req.body;
        //Validar duplicados
         let existFavorite = await Favorite.findOne({apodo: data.apodo});
        if(existFavorite) return res.status(404).send({message: 'Favorite already existed'}) 
        // save
        let favorite = new Favorite(data);
        await favorite.save();
        return res.send({ message: 'Favorite created sucessfully', favorite });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error Creating Favorite' })
    }
}

exports.getFavorites = async(req, res)=>{
    try{
        //Buscar datos
        let favorites = await Favorite.find();
        return res.send({message: 'Favorite found', favorites});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error getting favorites'});
    }
}


exports.getFavorite = async(req, res)=>{
    try{
        //Obtener el Id del producto a buscar
        let favoritetId = req.params.id;
        //Buscarlo en BD
        let favorite = await Favorite.findOne({_id: favoritetId});
        //Valido que exista el producto
        if(!favorite) return res.status(404).send({message: 'Favorite not found'});
        //Si existe lo devuelvo
        return res.send({message: 'Favorite found:', favorite});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error getting favorite'});
    }
}

exports.updateFavorite = async(req, res)=>{
    try{
        //obtener el Id del producto
        let favoritetId = req.params.id;
        //obtener la data a actualizar
        let data = req.body;
        
        //Actualizar
        let updateFavorite = await Favorite.findOneAndUpdate(
            {_id: favoritetId},
            data,
            {new: true}
        )
        if(!updateFavorite) return res.send({message: 'Favorite not found and not updated'});
        return res.send({message: 'Favorite updated:', updateFavorite});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error updating Favorite'});
    }
}

// Delete Favorite
exports.deleteFavorite = async (req, res) => {
    try {
        //Obtener el id a eliminar
        let favoritetId = req.params.id;
        //Eliminar el usuario
        let favoriteDeleted = await Favorite.findOneAndDelete({ _id: favoritetId });
        if (!favoriteDeleted) return res.send({ message: 'Favorite not found and not deleted' });
        return res.send({ message: `Favorite with username ${favoriteDeleted.apodo} deleted sucessfully` });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error not deleted' });
    }
}