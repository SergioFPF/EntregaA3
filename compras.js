// compras.js
const express = require('express');
const router = express.Router();
const db = require('./db');

router.get('/compras', (req, res) => {
  const query = `
    SELECT compras.idCompra, usuarios.nome as nomeUsuario, produtos.nome as nomeProduto, compras.quantidade, compras.dataCompra
    FROM compras
    INNER JOIN usuarios ON compras.idUsuario = usuarios.idUsuario
    INNER JOIN produtos ON compras.idProduto = produtos.idProduto
  `;

  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    const comprasHTML = results.map(compra => `<p><strong>ID Compra:&nbsp</strong>(${compra.idCompra}), <strong> Nome do Usuário:&nbsp</strong>(${compra.nomeUsuario}), <strong> Nome do Produto:&nbsp</strong>(${compra.nomeProduto}),&nbsp<strong> Quantidade:&nbsp</strong>(${compra.quantidade}),&nbsp<strong> Data da Compra:&nbsp</strong>(${compra.dataCompra})</p>`).join('<br>');
    res.send(`<h1>Compras realizadas</h1>${comprasHTML}`);
  });
});

module.exports = router;
