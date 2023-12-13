// estoqueRoutes.js
const express = require('express');
const router = express.Router();
const db = require('./db');

router.get('/estoque-baixo', (req, res) => {
    const estoqueBaixoQuery = 'SELECT * FROM produtos WHERE estoque < 20';
  
    db.query(estoqueBaixoQuery, (err, results) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      const produtosHTML = Array.isArray(results) ? results.map(produto => `<p><strong>ID Produto:&nbsp</strong>(${produto.idProduto}), <strong> Nome do produto:&nbsp</strong>(${produto.nome}), <strong> Estoque:&nbsp</strong>(${produto.estoque})</p>`) : [];
  
      res.send(`<h1>Produtos com Estoque Baixo</h1>${produtosHTML.join('')}`);
    });
  });
module.exports = router;
