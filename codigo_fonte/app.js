// app.js
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./db');
const usuariosRoutes = require('./usuariosRoutes');
const produtosRoutes = require('./produtosRoutes');
const comprasRoutes = require('./compras');
const estoqueRoutes = require('./estoqueRoutes');
const mediaRoutes = require('./mediaRoutes');
const vendasRoutes = require('./vendasRoutes');

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.use('/', usuariosRoutes);

app.use('/', produtosRoutes);

app.use('/', produtosRoutes);

app.use('/', estoqueRoutes);

app.use('/', comprasRoutes);

app.use('/', mediaRoutes);

app.use('/', vendasRoutes);

app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
