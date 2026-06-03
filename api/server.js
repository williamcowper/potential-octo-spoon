const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE, JSON.stringify({ charts: [] }, null, 2));

function readDB() {
  try {
    const raw = fs.readFileSync(DB_FILE);
    return JSON.parse(raw.toString());
  } catch (e) {
    return { charts: [] };
  }
}

function writeDB(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '1mb' }));

// Health
app.get('/_health', (req, res) => res.json({ ok: true }));

// List charts
app.get('/api/charts', (req, res) => {
  const db = readDB();
  res.json(db.charts || []);
});

// Create
app.post('/api/charts', (req, res) => {
  const db = readDB();
  const { title, option } = req.body;
  if (!title) return res.status(400).json({ error: 'title required' });
  const entry = { id: uuidv4(), title, option: option || {}, createdAt: new Date().toISOString() };
  db.charts.push(entry);
  writeDB(db);
  res.json(entry);
});

// Update
app.put('/api/charts/:id', (req, res) => {
  const id = req.params.id;
  const db = readDB();
  const idx = db.charts.findIndex(c => c.id === id);
  if (idx === -1) return res.status(404).json({ error: 'not found' });
  const { title, option } = req.body;
  if (title !== undefined) db.charts[idx].title = title;
  if (option !== undefined) db.charts[idx].option = option;
  db.charts[idx].updatedAt = new Date().toISOString();
  writeDB(db);
  res.json(db.charts[idx]);
});

// Delete
app.delete('/api/charts/:id', (req, res) => {
  const id = req.params.id;
  const db = readDB();
  const idx = db.charts.findIndex(c => c.id === id);
  if (idx === -1) return res.status(404).json({ error: 'not found' });
  const removed = db.charts.splice(idx, 1)[0];
  writeDB(db);
  res.json({ deleted: removed.id });
});

// Serve static if needed (not used when nginx proxies)
app.use(express.static(path.join(__dirname, '..', 'public')));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log('API server listening on', PORT));
