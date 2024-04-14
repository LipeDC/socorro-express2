const routerConta = require("./contaController");
const routerPerfil = require("./perfilController");
const routerEndereco = require("./enderecoController");
const routerChamada = require("./chamadaController");

module.exports = (app) => {
    app.use(routerConta);
    app.use(routerPerfil);
    app.use(routerEndereco);
    app.use(routerChamada);
    };