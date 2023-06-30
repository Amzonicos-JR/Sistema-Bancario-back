'use strict'

// Archivo para creacion de tokens
const jwt = require('jsonwebtoken');

exports.createToken = async(user)=>{
    try {
        let payload = {
            sub: user._id,
            name: user.name,
            surname: user.surname,
            username: user.username,
            noCuenta: user.noCuenta,
            email: user.email,
            DPI: user.DPI,
            direction: user.direction,
            ingresosMensuales: user.ingresosMensuales,
            balance: user.balance,
            role: user.role,
            iat: Math.floor(Date.now() / 1000),// fecha actual en formato UNIX | Segundos
            exp: Math.floor(Date.now() / 1000) + (60 * 120)
        }
        return jwt.sign(payload, `${process.env.SECRET_KEY}`)
    } catch (err) {
        console.error(err);
        return err;
    }
}