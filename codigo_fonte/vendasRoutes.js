// vendasRoutes.js
const express = require('express');
const router = express.Router();
const db = require('./db');

router.get('/produtos-mais-vendidos', (req, res) => {
  const produtosMaisVendidosQuery = `
    SELECT produtos.nome as nomeProduto, SUM(compras.quantidade) as totalVendido
    FROM compras
    INNER JOIN produtos ON compras.idProduto = produtos.idProduto
    GROUP BY compras.idProduto
    ORDER BY totalVendido DESC
  `;

  db.query(produtosMaisVendidosQuery, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    const vendasHTML = results.map(venda => `<p><strong>Nome do Produto:&nbsp</strong>(${venda.nomeProduto}), <strong> Total Vendido:&nbsp</strong>(${venda.totalVendido})</p>`);

    res.send(`<h1>Produtos Mais Vendidos</h1>${vendasHTML.join('')}`);
  });
});

module.exports = router;
