const express = require('express');
const cors = require('cors');
const database = require('./config/database');

const whatsappRoutes = require('./routes/whatsapp');
const clientesRoutes = require('./routes/clientes');


const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Rotas
app.use("/api/v1/clientes", clientesRoutes);
app.use("/api/v1/whatsapp", whatsappRoutes);


// Sincroniza com o banco e inicia o servidor
database.db
  .sync({ force: false })
  .then(() => {
    app.listen(3000, '0.0.0.0', () => {
      console.info('Servidor rodando na porta 3000');
    });
  })
  .catch((e) => {
    console.error("Erro ao conectar com o banco: ", e);
  });

module.exports = app;
