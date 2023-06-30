'use strict'

const Transfer = require('./transfer.model');
const User = require('../user/user.model');
const { validateData, checkPassword, checkUpdate } = require('../utils/validate');

exports.test = (req, res) => {
    res.send({ message: 'Test function is running (Transfer)' });
}

// Nueva Transferencia  (> Mayor), (< Menor)
exports.newTransfer = async (req, res) => {
    try {
        let data = req.body;
        data.DPIO = req.user.DPI;
        // Verificar que la cuenta exista
        let accountExist = await User.findOne({ noCuenta: data.accountNo });
        if (!accountExist) return res.send({ message: 'The account number entered does not exist' })
        if (data.DPIB != accountExist.DPI) return res.send({ message: 'DPI beneficiary not found' })
        // Validar que la transferencia no sea mayor que el balance de su propia cuenta
        //Encontrar datos del ordenante
        let ordenante = await User.findOne({ DPI: req.user.DPI })
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
        // Validar que no pueda transferir mas de (Q 10,000) por dia
        let amount = data.amount;
        let amountF = 0;
        amountF = parseInt(amount);
        let transfersFound = await Transfer.find({ status: 1 }, { DPIO: data.DPIO }, { date: data.date }).select('amount');
        // Recorrer las transferencias encontradas y sumar los amount
        let sum = 0;
        for (let i = 0; i < transfersFound.length; i++) {
            sum += transfersFound[i].amount;
        };
        if (sum + amountF == 10000) return res.send({ message: 'You cannot transfer more than Q10,000 per day.' })
        console.log(sum + amountF, 'Monto de transferencias por hoy / Paso')
        //Sumar el movimiento que realizará la persona
        let sumMovement = 1;
        let updatedUser = await User.findOneAndUpdate(
            {DPI: data.DPIO},
            { $inc: { movimientos: sumMovement } },
            { new: true }
        );
        // Crear la instancia 
        let transfer = new Transfer(data);
        await transfer.save();
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
        return res.send({ message: 'Transfer successfully completed', transfer });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error transfer', error: err.message });
    }
}

// Eliminar Transferencia (Revertir)
exports.revertir = async (req, res) => {
    try {
        // Obtener el id de la transferencia a revertir
        let idT = req.params.id;
        // Validar que la transferencia exista
        let existTransfer = await Transfer.findById(idT);
        if (!existTransfer) return res.send({ message: 'Transfer not found' });
        // Obtener los minutos de la transferencia a eliminar
        let minTransfer = parseInt(existTransfer.date.substr(15, 16));
        // console.log(minTransfer, 'minT')
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
        // Obtener los milisegundos de la fecha actual
        let minActual = parseInt(fActual.substr(15, 16)); // substring(), alternativa moderna a substr
        // console.log(minActual, 'minA')
        // Validar que la fecha de la transferencia, no haya pasado mas de (2 minutos)
        let minDiferencia = (minActual - minTransfer);
        console.log(minDiferencia, 'Minutos transcurridos')
        if (minDiferencia > 2) return res.send({ message: 'The transfer cannot be reversed, more than 2m have passed' })
        // Realizar cambios en el saldo de ambas cuentas
        let ordenante = await User.findOne({ DPI: existTransfer.DPIO })
        let beneficiario = await User.findOne({ DPI: existTransfer.DPIB })
        // Sumarle a la cuenta del ordenante
        let accountO = await User.updateOne
            (
                { noCuenta: ordenante.noCuenta },
                { $inc: { balance: +existTransfer.amount } }
            );
        // Descontarle a la cuenta del beneficiario
        let accountB = await User.updateOne
            (
                { noCuenta: beneficiario.noCuenta },
                { $inc: { balance: -existTransfer.amount } }

            );
        // Cambiar status de transferencia   
        let updateTransfer = await Transfer.findOneAndUpdate(
            { _id: idT },
            { $inc: { status: -1 } }
        )
        //Quitarle el movimiento que realizó
        let updatedUser = await User.findOneAndUpdate(
            { DPI: existTransfer.DPIO },
            { $inc: { movimientos: -1 } }
        )
        return res.send({ message: 'Transfer Successfully reversed', updateTransfer });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error not deleted' });
    }
}

// Obtener todas las transferencias
exports.getTransfers = async (req, res) => {
    try {
        let transfers = await Transfer.find();
        if (!transfers) return res.status(404).send({ message: 'Transfers not found' });
        return res.send({ message: 'Transfers found', transfers });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error not found' });
    }
}

// Obtener las transferencias de un usuario
exports.getTransfersById = async (req, res) => {
    try {
        console.log(req.user)
        let transfers = await Transfer.find({ DPIO: req.user.DPI, status: 1 });
        if (!transfers) return res.status(404).send({ message: 'Transfers not found' });
        return res.send({ message: 'Transfers found', transfers });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error not found' });
    }
}

