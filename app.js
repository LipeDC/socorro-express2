const express = require ('express');
const app = express();
const port = 3000;
const db = require('./infraestrutura/db');

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

