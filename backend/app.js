// ============================================
// app.js - Backend server for Notes CRUD API
// Using better-sqlite3 (no compilation issues on Railway)
// ============================================

const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to SQLite database (creates file if not exists)
const db = new Database('./notes.db');

// Create notes table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT
  )
`);
console.log('Notes table ready.');

// ============================================
// API Routes (CRUD)
// ============================================

// GET /api/notes - Fetch all notes
app.get('/api/notes', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM notes ORDER BY id DESC').all();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/notes/:id - Fetch a single note
app.get('/api/notes/:id', (req, res) => {
  try {
    const row = db.prepare('SELECT * FROM notes WHERE id = ?').get(req.params.id);
    if (!row) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/notes - Create a new note
app.post('/api/notes', (req, res) => {
  const { title, content } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }
  try {
    const info = db.prepare('INSERT INTO notes (title, content) VALUES (?, ?)').run(title, content || '');
    res.status(201).json({
      id: info.lastInsertRowid,
      title,
      content: content || ''
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/notes/:id - Update a note
app.put('/api/notes/:id', (req, res) => {
  const { title, content } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }
  try {
    const info = db.prepare('UPDATE notes SET title = ?, content = ? WHERE id = ?').run(title, content || '', req.params.id);
    if (info.changes === 0) {
      return res.status(404).json({ error: 'Note not found' });
    }
    const row = db.prepare('SELECT * FROM notes WHERE id = ?').get(req.params.id);
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/notes/:id - Delete a note
app.delete('/api/notes/:id', (req, res) => {
  try {
    const info = db.prepare('DELETE FROM notes WHERE id = ?').run(req.params.id);
    if (info.changes === 0) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.json({ message: 'Note deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});