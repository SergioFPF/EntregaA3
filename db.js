// db.js
const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', //digite dentro das aspas o mesmo nome de usuário definido durante a instalação do MySQL
  password: 'password', //digite dentro das aspas a mesma senha definida durante a instalação do MySQL
});

db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados MySQL', err.message);
  } else {
    console.log('Conectado ao banco de dados MySQL');

    // Criação do banco de dados
    db.query('CREATE DATABASE IF NOT EXISTS comprasdb', (err) => { //altere 'comprasdb' caso necessário 
      if (err) {
        console.error('Erro ao criar banco de dados', err.message);
      } else {
        console.log('Banco de dados "comprasdb" verificado/criado com sucesso.');

        // Use o banco de dados "comprasdb"
        db.query('USE comprasdb', (err) => { //Se 'comprasdb' foi alterada, o mesmo nome deverá ser subistituído aqui
          if (err) {
            console.error('Erro ao selecionar o banco de dados', err.message);
          } else {
            console.log('Usando o banco de dados "comprasdb".');

            // Criação da tabela de usuários
            db.query(`
              CREATE TABLE IF NOT EXISTS usuarios (
                idUsuario INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
                nome VARCHAR(255) NOT NULL,
                senha VARCHAR(255) NOT NULL
              )
            `, (err) => {
              if (err) {
                console.error('Erro ao criar tabela de usuarios', err.message);
              } else {
                console.log('Tabela "usuarios" verificada/criada com sucesso.');

                // Adiciona usuários após a criação da tabela
                db.query(`
                  INSERT INTO usuarios (idUsuario, nome, senha) VALUES
                  ('1', 'Ana', 'ana123'),
                  ('2', 'Roger', 'Roger123'),
                  ('3', 'Fabio', 'fabio123'),
                  ('4', 'Fernanda', 'fernanda123'),
                  ('5', 'Dalila', 'dalila123')
                  ON DUPLICATE KEY UPDATE nome = VALUES(nome), senha = VALUES(senha)
                `, (err) => {
                  if (err) {
                    console.error('Erro ao adicionar usuários', err.message);
                  } else {
                    console.log('Usuários adicionados com sucesso.');
                  }
                });

                // Criação da tabela de produtos
                db.query(`
                  CREATE TABLE IF NOT EXISTS produtos (
                    idProduto INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
                    nome VARCHAR(255) NOT NULL,
                    estoque INT NOT NULL
                  )
                `, (err) => {
                  if (err) {
                    console.error('Erro ao criar tabela de produtos', err.message);
                  } else {
                    console.log('Tabela de produtos verificada/criada com sucesso.');

                    // Adiciona produtos após a criação da tabela
                    db.query(`
                      INSERT INTO produtos (idProduto, nome, estoque) VALUES
                      (1, 'Mouse', 39),
                      (2, 'Monitor', 50),
                      (3, 'Notebook', 50),
                      (4, 'impressora', 15),
                      (5, 'Fones de ouvido', 18),
                      (6, 'Webcam', 50),
                      (7, 'Caixa de som', 50),
                      (8, 'mousepad', 30),
                      (9, 'Scanner', 50),
                      (10, 'teclado', 30)
                      ON DUPLICATE KEY UPDATE nome = VALUES(nome), estoque = VALUES(estoque)
                    `, (err) => {
                      if (err) {
                        console.error('Erro ao inserir ou atualizar produto', err.message);
                      } else {
                        console.log('Produto inserido ou atualizado com sucesso.');
                      }
                    });

                    // Criação da tabela de compras
                    db.query(`
                      CREATE TABLE IF NOT EXISTS compras (
                        idCompra INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
                        idUsuario INT NOT NULL,
                        idProduto INT NOT NULL,
                        quantidade INT NOT NULL,
                        dataCompra TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        FOREIGN KEY (idUsuario) REFERENCES usuarios(idUsuario),
                        FOREIGN KEY (idProduto) REFERENCES produtos(idProduto)
                      )
                    `, (err) => {
                      if (err) {
                        console.error('Erro ao criar tabela de compras', err.message);
                      } else {
                        console.log('Tabela de compras verificada/criada com sucesso.');
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  }
});

module.exports = db;
