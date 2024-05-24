const Sequelize = require('sequelize');
const database = require('../database/db');
const Perfil = require('./perfilModel');
const Endereco = require('./enderecoModel')

const Chamada = database.define('Chamada', {
    idChamada: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    id_Perfil: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
            model: 'Perfil',
            key: 'idPerfil'
        },
        onDelete: 'SET NULL'
    },
    id_Endereco: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
            model: 'Endereco',
            key: 'idEndereco'
        },
        onDelete: 'SET NULL'
    },
    cod_ambu: {
        type: Sequelize.STRING(100),
        allowNull: true
    },
    data_criacao: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    data_atualizacao: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        onUpdate: Sequelize.literal('CURRENT_TIMESTAMP')
    }
}, {
    timestamps: false,
    tableName: 'Chamada'
});

Chamada.belongsTo(Perfil, {
    foreignKey: 'id_Perfil',
    targetKey: 'idPerfil'
});

Chamada.belongsTo(Endereco, {
    foreignKey: 'id_Endereco',
    targetKey: 'idEndereco'
});
module.exports = Chamada;
