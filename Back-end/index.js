const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;
const router = require('./controllers/indexRouters');
const db = require('./database/db');

//middleware CORS
app.use(cors());

router(app, express);

db.sync()
  .then(() => {
    console.log('Banco de dados conectado e modelos sincronizados.');
    app.listen(port, () => {
      console.log('Servidor rodando na porta ' + port);
    });
  })
  .catch(err => {
    console.error('Erro ao conectar ao banco de dados:', err);
  });
