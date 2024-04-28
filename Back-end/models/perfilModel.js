const Sequelize = require('sequelize');
const database = require('../database/db');
const Conta = require('./contaModel');

const Perfil = database.define('Perfil', {
    idPerfil: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    id_Conta: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true, // Adicionando a restrição UNIQUE
        references: {
            model: Conta,
            key: 'idConta'
        }
    },
    data_nasc: {
        type: Sequelize.DATEONLY,
        allowNull: false
    },
    sexo: {
        type: Sequelize.ENUM('M', 'F'),
        allowNull: false
    },
    tipo_sang: {
        type: Sequelize.ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'),
        allowNull: false
    },
    doenca_pre: {
        type: Sequelize.STRING(100),
        allowNull: true
    },
    remedio: {
        type: Sequelize.STRING(100),
        allowNull: true
    },
    descricao: {
        type: Sequelize.TEXT,
        allowNull: true
    }
}, {
    timestamps: false,
    tableName: 'Perfil'
});

Perfil.belongsTo(Conta, {
    foreignKey: "id_Conta",
    targetKey: "idConta"
})

module.exports = Perfil;