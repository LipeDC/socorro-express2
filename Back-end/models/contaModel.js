const Sequelize = require('sequelize');
const database = require('../database/db');

const Conta = database.define('Conta', {
    idConta: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    nome: {
        type: Sequelize.STRING(80),
        allowNull: false
      },
    email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true
    },
    senha: {
        type: Sequelize.STRING(255),
        allowNull: false
    }
}, {
    timestamps: false,
    tableName: 'Conta' 
});

module.exports = Conta;