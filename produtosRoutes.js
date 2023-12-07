// produtosRoutes.js
const express = require('express');
const router = express.Router();
const db = require('./db');

router.get('/produtos', (req, res) => {
  db.query('SELECT * FROM produtos', (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    const produtosHTML = results.map(produto => `<p><strong>ID:&nbsp</strong>(${produto.idProduto}),&nbsp<strong>Nome:&nbsp</strong>(${produto.nome}),&nbsp<strong>Estoque:&nbsp</strong>(${produto.estoque})</p>`).join('<br>');
    res.send(`<h1>Lista de Produtos</h1>${produtosHTML}`);
  });
});

router.post('/produtos', (req, res) => {
  const { nome, estoque } = req.body;
  db.query('INSERT INTO produtos (nome, estoque) VALUES (?, ?)', [nome, estoque], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ idProduto: results.insertId });
  });
});

router.get('/produtos/:idProduto', (req, res) => {
  const { idProduto } = req.params;
  db.query('SELECT * FROM produtos WHERE idProduto = ?', [idProduto], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ produto: results[0] });
  });
});

router.put('/produtos/:idProduto', (req, res) => {
  const { nome, estoque } = req.body;
  const { idProduto } = req.params;
  db.query('UPDATE produtos SET nome = ?, estoque = ? WHERE idProduto = ?', [nome, estoque, idProduto], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ idProduto: parseInt(idProduto), nome, estoque });
  });
});

router.delete('/produtos/:idProduto', (req, res) => {
  const { idProduto } = req.params;
  db.query('DELETE FROM produtos WHERE idProduto = ?', [idProduto], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ deleted: true });
  });
});
module.exports = router;
