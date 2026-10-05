const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public')); 
const db = new sqlite3.Database('./banco.db', (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err.message);
  } else {
    console.log('Conectado ao banco de dados SQLite.');
  }
});

db.run(`
  CREATE TABLE IF NOT EXISTS pets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    especie TEXT NOT NULL,
    idade TEXT NOT NULL,
    status TEXT NOT NULL
  )
`);


app.get('/api/pets', (req, res) => {
  db.all('SELECT * FROM pets', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/pets', (req, res) => {
  const { nome, especie, idade, status } = req.body;
  const sql = 'INSERT INTO pets (nome, especie, idade, status) VALUES (?, ?, ?, ?)';
  
  db.run(sql, [nome, especie, idade, status || 'Disponível'], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID, nome, especie, idade, status: status || 'Disponível' });
  });
});

app.put('/api/pets/:id', (req, res) => {
  const { id } = req.params;
  const { nome, especie, idade, status } = req.body;
  const sql = 'UPDATE pets SET nome = ?, especie = ?, idade = ?, status = ? WHERE id = ?';

  db.run(sql, [nome, especie, idade, status, id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Pet atualizado com sucesso!' });
  });
});

app.delete('/api/pets/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM pets WHERE id = ?', id, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Pet removido com sucesso!' });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor a rodar em http://localhost:${PORT}`);
});