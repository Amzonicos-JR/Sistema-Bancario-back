'use strict'
const User = require('../user/user.model');
const Loan = require('./loan.model');

exports.addLoan = async (req, res) => {
    try {
        let data = req.body;
        //Buscar al usuario por su DPI
        let user = await User.findOne({ DPI: data.DPI });
        if (!user) return res.send({ message: 'User not found' });
        data.interestRate = 12;
        if (data.amount < 1000) {//Verificar que sea el minimo
            return res.send({ message: 'The minimum is 1000' })
        } else if (data.amount > 10000) {//Verificar que no sobrepase el máximo
            return res.send({ message: 'The maximum is 10000' })
        }
        let interes = Number(data.interestRate) * Number(data.amount) / 100;
        let pay = Number(interes) + Number(data.amount);
        data.monthlyFee = Number(pay) / Number(data.durationMonths);
        data.totalPay = pay;
        let newBalance = Number(data.amount);
        let movement = 1;
        let userUpdated = await User.findOneAndUpdate({ DPI: data.DPI },
            { $inc: { balance: newBalance } },
            { new: true }
        );
        let movimiento = await User.findOneAndUpdate({DPI: data.DPI}, { $inc: {movimientos: movement}}, {new: true});
        let loan = new Loan(data);
        await loan.save();
        return res.send({ message: 'accepted loan' });
    } catch (err) {
        console.error(err);
        return res.send({ message: 'Error request loan' });
    }
}

exports.getLoans = async (req, res) => {
    try {
        let loans = await Loan.find();
        return res.send({message: 'Loans found: ', loans})
    } catch (err) {
        console.error(err);
        return res.send({ message: 'Error get loan' });
    }
}

exports.getLoanByUser = async (req, res) => {
    try {
        //Obtener el id del usuario
        let data = req.body;
        //Buscar el prestamo que tiene
        let loan = await Loan.findOne({ DPI: data.DPI });
        return res.send({ message: 'your loan', loan })
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error getting loan' })
    }
}