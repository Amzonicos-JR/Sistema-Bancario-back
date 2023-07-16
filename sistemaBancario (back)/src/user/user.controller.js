'use strict'

const User = require('./user.model');
const { validateData, encrypt, checkPassword, checkUpdate } = require('../utils/validate');
const { createToken } = require('../services/jwt');
const userInfo = ['DPI', 'noCuenta', 'name', 'surname', 'email', 'balance', 'movimientos']
const infoUpdate = ['DPI', 'name', 'surname', 'username', 'email', 'direction', 'ingresosMensuales']

exports.test = (req, res)=>{
    res.send({message: 'Test function is running', user: req.user});
}

exports.adminBank = async (req, res) => {
    try {
        let data = {
            name: 'Amzonico',
            surname: 'Junior',
            username: 'ADMINB',
            password: 'ADMINB',
            email: 'amzonico@gmail.com',
            DPI: '123456789',
            direction: 'Zona 10',
            role: 'ADMINAM'
        }
        data.password = await encrypt(data.password)
        let existsUser = await User.findOne({ username: 'ADMINB' })
        if (existsUser) return console.log('Admin already created');
        let defaultAM = new User(data);
        await defaultAM.save();
        return console.log('Admin created sucessfully')
    } catch (err) {
        console.log(err); 
    }
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

exports.createAccount = async(req, res)=>{
    try{
        let data = req.body;
        let params = {
            name: data.name,
            surname: data.surname,
            username: data.username,
            password: data.password,
            email: data.email,
            DPI: data.DPI,
            direction: data.direction,
            ingresosMensuales: data.ingresosMensuales,
            balance: data.balance
        }
        if(!params)  return res.send({message: 'Ingrese todos los campos requeridos'})
        if(data.ingresosMensuales<100) return res.send({message: 'Tus ingresos mensuales no suficientes para crear una cuenta'})
        if(data.DPI.length != 13) return res.send({message:'El DPI ingresado no es válido'})
        data.role='CLIENT'
        data.noCuenta= getRandomIntInclusive(10000000,99999999)
        let userExist= await User.findOne({
            $or: [
                {username: data.username},
                {DPI: data.DPI},
                {noCuenta: data.noCuenta},
                {email: data.email}

            ]
        })
        if(userExist) return res.send({message: 'Username, DPI or no. of account already registered'})
        data.password = await encrypt(data.password);
        let user = new User(data);
        await user.save();
        return res.send({message: 'Account created sucessfully', user});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error creating account', error: err.message});
    }
}

exports.login = async (req, res) => {
    try {
        let data = req.body;
        let credentials = {
            username: data.username,
            password: data.password
        }
        let msg = validateData(credentials);
        if (msg) return res.status(400).send(msg)
        let user = await User.findOne({ username: data.username });
        if (user && await checkPassword(data.password, user.password)) {
            let userLogged = {
                _id: user.id,
                role: user.role
            }
            let token = await createToken(user)
            return res.send({ message: 'User logged sucessfully', token, userLogged });
        }
        return res.status(401).send({ message: 'Invalid credentials' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error, not logged' });
    }
}
exports.getAccounts = async(req, res)=>{
    try{
        let users = await User.find({role: 'CLIENT'}).select(userInfo);
        if(!users) return res.status(404).send({message: 'Accounts not found'});
        return res.send({message: 'Accounts found', users});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error not found'});
    }
}

exports.get = async(req, res)=>{
    try {
        let users = await User.find();
        if(!users) return res.status(404).send({message: 'Users not found'});
        return res.send({message: 'Users found', users});

    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error not found'})
    }
}

exports.getAdmins = async(req, res)=>{
    try{
        let admins = await User.find({role: 'ADMINAM'});
        if(!admins) return res.status(404).send({message: 'Admins not found'});
        return res.send({message: 'Admins found', admins});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error not found'});      
    }
}

exports.getAccountById = async(req, res)=>{
    try {
        let userId = req.params.id;
        let user = await User.findOne({ _id: userId }).select(infoUpdate);
        if (!user) return res.status(404).send({ message: 'User not found' });
        return res.send({ message: 'User found', user: user })
    } catch (err) {
        console.error(err);
        return res.statuts(500).send({ message: 'Error getting user' });
    }
}

exports.getProfile = async (req, res)=>{
    try {
        //let userId = req.params.id;
        let user = await User.findOne({ _id: req.user.sub})
        if (!user) return res.status(404).send({ message: 'User not found' });
        return res.send({ message: 'User found', user: user })
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error getting user' });
    }
}

exports.getAdminById = async(req, res)=>{
    try{
        let userId = req.params.id;
        let existAdmin = await User.findOne({_id: userId, role:'ADMINAM'});
        if(!existAdmin) return res.status(404).send({message: 'Admin not found or is not admin role'});
        return res.send({message: 'Admin found', existAdmin});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error not found'});
    }
}

exports.delete = async(req, res)=>{
    try{
        let userId = req.params.id;
        //if( userId != req.user.sub) return res.status(401).send({message: 'Dont have permission to do this action'});
        let userDeleted = await User.findOneAndDelete({_id: userId});
        if(!userDeleted) return res.send({message: 'Account not found and not deleted'});
        return res.send({message: `Account with username ${userDeleted.username} deleted sucessfully`});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error not deleted'});
    }
}

exports.update = async (req, res) => {
    try {
        let userId = req.params.id;
        let data = req.body;
        if (data.password || Object.entries(data).length === 0 || data.role || data.DPI) return res.status(400).send({ message: 'Have submitted some data that cannot be updated' });
        let existUser = await User.findOne({ _id: userId });
        if (existUser) {
            let userUp = await User.findOneAndUpdate(
                { _id: userId },
                data,
                { new: true }
            )
            return res.send({ message: 'Updating user', userUp });
        }
        return res.send({ message: 'User not found or not updating' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error updating user' })
    }
}

exports.updatePassword = async (req, res) => {
    try {
      let data = req.body;
      //let userId = req.params.id;
      let user = await User.findOne({ _id: req.user.sub });
      if (await checkPassword(data.password, user.password)) {
        if (Object.entries(data).length === 0) return res.status(400).send({ message: 'Have submitted some data that cannot be updated' });
        let newPassword = await encrypt(data.newPassword);
        let updatePassword = await User.findOneAndUpdate(
          { _id: req.user.sub },
          { password: newPassword },
          { new: true }
        );
        if (!updatePassword)
          return res
            .status(404)
            .send({ message: "User not found and password not updated" });
        return res.send({
          message: "The password has been successfully updated",
          updatePassword
        });
      } else {
        return res.send({ message: "Passwords do not match" });
      }
    } catch (err) {
      console.error(err);
      return res.send({ message: "Error, could not update password" });
    }
  };