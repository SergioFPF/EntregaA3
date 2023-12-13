// usuarioRoutes.js
const express = require('express');
const router = express.Router();
const db = require('./db');

router.get('/usuarios', (req, res) => {
  db.query('SELECT * FROM usuarios', (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    const usuariosHTML = results.map(user => `<p><strong>ID:&nbsp</strong>(${user.idUsuario}),&nbsp<strong> Nome:&nbsp</strong>(${user.nome}),&nbsp<strong> Senha:&nbsp</strong>(${user.senha})</p>`).join('<br>');
    res.send(`<h1>Usuários cadastrados</h1>${usuariosHTML}`);
  });
});

router.post('/usuarios', (req, res) => {
  const { nome, senha } = req.body;
  db.query('INSERT INTO usuarios (nome, senha) VALUES (?, ?)', [nome, senha], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ idUsuario: results.insertId });
  });
});

router.get('/usuarios/:idUsuario', (req, res) => {
  const { idUsuario } = req.params;
  db.query('SELECT * FROM usuarios WHERE idUsuario = ?', [idUsuario], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ usuarios: results[0] });
  });
});

router.put('/usuarios/:idUsuario', (req, res) => {
  const { nome, senha } = req.body;
  const { idUsuario } = req.params;
  db.query('UPDATE usuarios SET nome = ?, senha = ? WHERE idUsuario = ?', [nome, senha, idUsuario], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ idUsuario: parseInt(idUsuario), nome, senha });
  });
});

router.delete('/usuarios/:idUsuario', (req, res) => {
  const { idUsuario } = req.params;
  db.query('DELETE FROM usuarios WHERE idUsuario = ?', [idUsuario], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ deleted: true });
  });
});

// (compras)
router.post('/usuarios/comprar', (req, res) => {
  const { idUsuario, idProduto, quantidade } = req.body;

  // Verifica se o usuário existe
  const verificaUsuario = 'SELECT * FROM usuarios WHERE idUsuario = ?';
  db.query(verificaUsuario, [idUsuario], (err, resultsUsuario) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    const usuarioExistente = resultsUsuario[0];

    if (!usuarioExistente) {
      res.status(400).json({ error: 'Usuário não encontrado.' });
      return;
    }

    // Verifica se o produto existe
    const verificaProduto = 'SELECT * FROM produtos WHERE idProduto = ?';
    db.query(verificaProduto, [idProduto], (err, resultsProduto) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      const produtoExistente = resultsProduto[0];

      if (!produtoExistente) {
        res.status(400).json({ error: 'Produto não encontrado.' });
        return;
      }

      // Verifica se há estoque suficiente
      if (quantidade > produtoExistente.estoque) {
        res.status(400).json({ error: 'Estoque insuficiente para a quantidade desejada.' });
        return;
      }

      // Realiza a compra, atualizando o estoque e registrando a compra
      db.beginTransaction((err) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }

        const atualizaEstoque = 'UPDATE produtos SET estoque = estoque - ? WHERE idProduto = ?';
        db.query(atualizaEstoque, [quantidade, idProduto], (err) => {
          if (err) {
            return db.rollback(() => {
              res.status(500).json({ error: err.message });
            });
          }

          const registraCompra = 'INSERT INTO compras (idUsuario, idProduto, quantidade) VALUES (?, ?, ?)';
          db.query(registraCompra, [idUsuario, idProduto, quantidade], (err) => {
            if (err) {
              return db.rollback(() => {
                res.status(500).json({ error: err.message });
              });
            }

            db.commit((err) => {
              if (err) {
                return db.rollback(() => {
                  res.status(500).json({ error: err.message });
                });
              }

              res.json({ mensagem: 'Compra realizada com sucesso.' });
            });
          });
        });
      });
    });
  });
});


module.exports = router;
