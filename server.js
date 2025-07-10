const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

const DATA_FILE = path.join(__dirname, 'count.json');
if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify({ count: 0 }));

app.use(express.static('public'));
app.use(express.json());

app.get('/count', (req, res) => {
  const { count } = JSON.parse(fs.readFileSync(DATA_FILE));
  res.json({ count });
});

app.post('/increment', (req, res) => {
  const auth = req.headers.authorization;
  if (auth !== 'blupblupblup') {
    return res.status(403).json({ error: 'Acesso negado' });
  }

  const data = JSON.parse(fs.readFileSync(DATA_FILE));
  data.count++;
  fs.writeFileSync(DATA_FILE, JSON.stringify(data));
  res.json({ count: data.count });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
