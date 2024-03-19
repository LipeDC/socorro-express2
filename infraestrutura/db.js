const Sequelize = require('sequelize');

const db = new Sequelize('formulario-cadastro', 'root', 'root',
{
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = db;