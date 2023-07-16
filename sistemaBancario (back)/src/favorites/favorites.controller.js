'use strict'

const Favorites = require('./favorites.model')
const User = require('../user/user.model')
// Funcion test
exports.test = (req, res) => {
    res.send({ message: 'Test function is running Favorite' });
}

// Add Favorite
exports.addFavorite = async (req, res) => {
    try {
        let data = req.body;
        let user = req.user.sub
        //Validar que exista el usuario a agregar
        const userExists = await User.findOne({ noCuenta: data.noCuenta });
        if (!userExists) {
            return res.send({ message: 'Invalid NoCuenta. User does not exist' });
        }
        // Validar que no se duplique un usuario
        const favoriteExist = await Favorites.findOne({noCuenta: userExists.noCuenta});
        if(favoriteExist) return res.send({message: 'User already added to favorites'})
        const userFavorite = await User.findOne({ NoCuenta: data.NoCuenta });
        if (userFavorite._id.toString() === user) {
            return res.send({ message: 'You cannot add the favorite to yourself' });
        }
        /* data.user = req.user.sub */
        data.user = data.user;
        let favorites = new Favorites(data);
        await favorites.save(); 
        return res.send({ message: 'Favorite created sucessfully', favorites });
        
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error creating favorite', error: err.message })
    }
}

exports.getById = async (req, res) => {
    try {
        /* //Obtener el Id 
        let favoriteId = req.params.id;
        //Buscarlo en BD
        let favorites = await Favorites.findOne({_id: favoriteId}).populate('noCuenta');
        //Valido que exista 
        if(!favorites) return res.status(404).send({message: 'Favorite not found'});
        //Si existe lo devuelvo
        return res.send({message: 'Favorite found:', favorites}); */
        // Buscar el usuario
        let data = req.params.id;
        let user = await User.findById({ _id: data }).select('name');
        if (!user) return res.status(404).send({ message: 'User not found' });
        // Buscar las reservaciones del usuario
        let favorites = await Favorites.find({ user: data }).populate('user')
        if (!favorites) return res.status(404).send({ message: 'Favorites not found' });
        return res.send({ favorites });

    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error getting favorite' });
    }
}

// Obtener los favoritos de la cuenta
exports.get = async (req, res) => {
    try {
        const userId = req.user.sub;
        const favorites = await Favorites.find({ user: userId });
        if (!favorites) {
            return res.status(404).send({ message: 'Favorites not found' });
        }
        return res.send({ message: 'Favorites found', favorites });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error getting favorites' });
    }
}

exports.updateFavorite = async (req, res) => {
    try {
        // Obtener el id del favorito a actualizar
        let idF = req.params.id;
        //Validar que exista el favorito
        const favorito = await Favorites.findOne({ _id: idF });
        if (favorito) {
            // Obtener los nuevos datos a actualizar
            let data = req.body;
            // Validar que no vengan datos no actualizables
            if (data.noCuenta || Object.entries(data).length === 0 || data.DPI) return res.status(400).send({ message: 'Have submitted some data that cannot be updated' });
            let updateF = await Favorites.findOneAndUpdate(
                {_id: idF},
                data,
                { new : true }
            )
            return res.send({ message: 'Updating favorite', updateF });
        }
        return res.send({ message: 'Favorit not found' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error updating favorite' });
    }
}

// Delete Favorite
exports.deleteFavorite = async (req, res) => {
    try {
        let idfavorite = req.params.id;
        let deletedFavorite = await Favorites.findOneAndDelete({ _id: idfavorite });
        if (!deletedFavorite) return res.status(404).send({ message: 'Error removing favorite or already deleted' });
        return res.send({ message: 'Favorite deleted sucessfully', deletedFavorite });
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error removing favorite' })
    }
}

// Transfer fast
// exports.transferF = async (req, res) => {
//     try {
//         let idFavorite = req.params.id;
//         //Obtener los datos del favorito
//         const datos = await Favorites.findOne({_id: idFavorite});
//         console.log(datos, 'datos')
//         return res.send({ message: 'Favorite deleted sucessfully', deletedFavorite });
//     } catch (err) {
//         console.error(err)
//         return res.status(500).send({ message: 'Error transfer fast' })
//     }
// }