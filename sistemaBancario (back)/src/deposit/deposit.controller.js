'use strict'

// const Transfer = require('./transfer.model');
const User = require('../user/user.model');
const Deposit = require('../deposit/deposit.model');
const { validateData, checkPassword, checkUpdate } = require('../utils/validate');

exports.test = (req, res) => {
    res.send({ message: 'Test function is running (Transfer)' });
}

// NuevO DEPOSIO  (> Mayor), (< Menor)
exports.newDeposit = async (req, res) => {
    try {
        let data = req.body;
        data.DPIO = data.DPIO;
        // Verificar que la cuenta exista
        let accountExist = await User.findOne({ noCuenta: data.accountNo });
        if (!accountExist) return res.send({ message: 'The account number entered does not exist' })
        if (data.DPIB != accountExist.DPI) return res.send({ message: 'DPI beneficiary not found' })
        // Validar que el deposito no sea mayor que el balance de su propia cuenta
        //Encontrar datos del ordenante
        let ordenante = await User.findOne({ DPI: data.DPIO })
        if (ordenante.balance < data.amount) return res.send({ message: 'Insufficient balance' });
        // Validar que la transferencia sea de (MIN: Q. 1)
        if (data.amount <= 0) return res.send({ message: 'Q1 is the minimum amount for transfer' })
        // Validar que la transferencia sea (MAX: Q. 2000)
        if (data.amount > 2000) return res.send({ message: 'You cannot transfer more than Q.2000' })
        // Agregarle la fecha de hoy automaticamente
        let fecha = new Date();
        data.date = fecha.toLocaleString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        }).replace('.', ','); //Formato de fecha formateado a las convecciones del navegador(Español)
        // Crear la instancia 
        let deposit = new Deposit(data);
        await deposit.save();
        // Realizar cambios en el saldo de ambas cuentas
        // Descontar de la cuenta del ordenante
        let accountO = await User.updateOne
            (
                { noCuenta: ordenante.noCuenta },
                { $inc: { balance: -data.amount } }
            );
        // Sumarle a la cuenta del beneficiario
        let accountB = await User.updateOne
            (
                { noCuenta: accountExist.noCuenta },
                { $inc: { balance: +data.amount } }

            );
        return res.send({ message: 'Deposit successfully completed', deposit });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error deposit', error: err.message });
    }
}


// Eliminar el deposito (Revertir)
exports.revertir = async (req, res) => {
    try {
        // Obtener el id de la transferencia a revertir
        let idD = req.params.id;
        // Validar que el deposito exista
        let existDeposit = await Deposit.findById(idD);
        if (!existDeposit) return res.send({ message: 'Deposit not found' });
        // Obtener los minutos del deposito a eliminar
        let minDeposit = parseInt(existDeposit.date.substr(15, 16));
        console.log(minDeposit, 'minT')
        // Obtener la fecha actual
        let fecha = new Date();
        let fActual = fecha.toLocaleString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        }).replace('.', ',');
        // Obtener los minutos de la fecha actual
        let minActual = parseInt(fActual.substr(15, 16)); // substring(), alternativa moderna a substr
        console.log(minActual, 'minA')
        // Validar que la fecha del deposito, no haya pasado mas de (2 minutos)
        let minDiferencia = (minActual - minDeposit);
        console.log(minDiferencia, 'Minutos transcurridos')
        if (minDiferencia > 2) return res.send({ message: 'The deposito cannot be reversed, more than 2m have passed' })
        // Realizar cambios en el saldo de ambas cuentas
        let ordenante = await User.findOne({ DPI: existDeposit.DPIO })
        let beneficiario = await User.findOne({ DPI: existDeposit.DPIB })
        // Sumarle a la cuenta del ordenante
        let accountO = await User.updateOne
            (
                { noCuenta: ordenante.noCuenta },
                { $inc: { balance: +existDeposit.amount } }
            );
        // Descontarle a la cuenta del beneficiario
        let accountB = await User.updateOne
            (
                { noCuenta: beneficiario.noCuenta },
                { $inc: { balance: -existDeposit.amount } }

            );
        // Cambiar status de deposit 
        let updateDeposit = await Deposit.findOneAndUpdate(
            { _id: idD },
            { $inc: { status: -1 } }
        )
        return res.send({ message: 'Deposit Successfully reversed', updateDeposit });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error not deleted' });
    }
}

// Obtener todos los depositos
exports.getDeposits = async (req, res) => {
    try {
        let deposit = await Deposit.find({status: 1});
        if (!deposit) return res.status(404).send({ message: 'Deposits not found' });
        return res.send({ message: 'Deposits found', deposit });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error not found' });
    }
}
