const Sequelize = require('sequelize');
const database = require('../database/db');
const Perfil = require('./perfilModel');

const Endereco = database.define('Endereco', {
    idEndereco: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    id_Perfil: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    nome_end: {
        type: Sequelize.STRING(80),
        allowNull: false
    },
    endereco: {
        type: Sequelize.STRING(255),
        allowNull: false
    }
}, {
    timestamps: false,
    tableName: 'Endereco'
});

Endereco.belongsTo(Perfil, {
    foreignKey: 'id_Perfil',
    targetKey: 'idPerfil'
});

module.exports = Endereco;
