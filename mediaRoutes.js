// mediaRoutes.js
const express = require('express');
const router = express.Router();
const db = require('./db');

router.get('/media', (req, res) => {
  const mediaQuantidadeQuery = `
    SELECT usuarios.nome as nomeUsuario, AVG(compras.quantidade) as mediaQuantidade
    FROM compras
    INNER JOIN usuarios ON compras.idUsuario = usuarios.idUsuario
    GROUP BY compras.idUsuario
  `;

  db.query(mediaQuantidadeQuery, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    const mediaHTML = results.map(media => `<p><strong>Nome do usuário:&nbsp</strong>(${media.nomeUsuario}), <strong> Média das compras:&nbsp</strong>(${media.mediaQuantidade})</p>`);

    res.send(`<h1>Média de compras por usuário</h1>${mediaHTML.join('')}`);
  });
});

module.exports = router;
