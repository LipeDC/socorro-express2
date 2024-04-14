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
        allowNull: true,
    },
    rua: {
        type: Sequelize.STRING(100),
        allowNull: false
    },
    cidade: {
        type: Sequelize.STRING(100),
        allowNull: false
    },
    estado: {
        type: Sequelize.STRING(50),
        allowNull: false
    },
    cep: {
        type: Sequelize.STRING(20),
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
