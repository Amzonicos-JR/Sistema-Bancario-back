'use strict'

const express = require('express');
//Logs de las solicitudes que recibe el servidor
const morgan = require('morgan');
//Aplica seguridad básica al servidor
const helmet = require('helmet');
//Aceptación de solicitudes desde otro sistema o desde la misma máquina
const cors = require('cors');
//Instancia de express
const app = express();
const port = process.env.PORT || 3500;

// Routes
const userRoutes = require('../src/user/user.routes')
const transferRoutes = require('../src/transfer/transfer.routes')
const favoriteRoutes = require('../src/favorites/favorites.routes');
const serviceBankRoutes = require('../src/servicesBank/serviceBank.routes')
const productRoutes = require('../src/products/products.routes')
const purchasesRoutes = require('../src/purchases/purchases.routes')
const loanRoutes = require('../src/loan/loan.routes')

//CONFIGURAR EL SERVIDOR HTTP DE EXPRESS
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Ruta
app.use('/user', userRoutes);
app.use('/transfer', transferRoutes)
app.use('/favorite', favoriteRoutes);
app.use('/serviceBank', serviceBankRoutes);
app.use('/product', productRoutes)
app.use('/purchases', purchasesRoutes);
app.use('/loan', loanRoutes);

//Función donde se levanta el servidor
exports.initServer = () => {
    app.listen(port);
    console.log(`Server http running in port ${port}`);
}