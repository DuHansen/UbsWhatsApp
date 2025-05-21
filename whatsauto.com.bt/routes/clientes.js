const express = require('express');
const ClientesApi = require('../api/clientes');  // Importando a API
const userRouter = express.Router();

userRouter.get('/', (req, res) => {res.send('Hello World');
  
})
userRouter.get('/pegar', ClientesApi.getClientes);
userRouter.post('/pegar/:id', ClientesApi.getCliente);
userRouter.post('/adicionar', ClientesApi.createCliente);

module.exports = userRouter;
