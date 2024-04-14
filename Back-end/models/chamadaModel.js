const Sequelize = require('sequelize');
const database = require('../database/db');
const Conta = require('./contaModel');

const Chamada = database.define('Chamada', {
    idChamada: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    id_Conta: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    cod_ambu: {
        type: Sequelize.STRING(100),
        allowNull: false
    }
}, {
    timestamps: false,
    tableName: 'Chamada'
});

Chamada.belongsTo(Conta, {
    foreignKey: 'id_Conta',
    targetKey: 'idConta'
});

module.exports = Chamada;
