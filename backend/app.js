// ============================================
// app.js - Backend server for Notes CRUD API
// ============================================

// 1. Import required packages
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose(); // verbose mode for detailed errors

// 2. Create Express app
const app = express();
const PORT = process.env.PORT || 3000; // Use environment port or 3000

// 3. Middleware
app.use(cors()); // Allow cross-origin requests from frontend
app.use(express.json()); // Parse JSON request bodies

// 4. Connect to SQLite database (file will be created automatically)
//    The database file "notes.db" will be placed in the same folder as app.js
const db = new sqlite3.Database('./notes.db', (err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
  }
});

// 5. Create the "notes" table if it doesn't exist
//    Columns: id (auto-increment), title (text), content (text)
db.run(`
  CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT
  )
`, (err) => {
  if (err) {
    console.error('Error creating table:', err.message);
  } else {
    console.log('Notes table ready.');
  }
});

// ============================================
// API Routes (CRUD)
// ============================================

// 6. GET /api/notes - Fetch all notes
app.get('/api/notes', (req, res) => {
  const sql = 'SELECT * FROM notes ORDER BY id DESC';
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// 7. GET /api/notes/:id - Fetch a single note by id
app.get('/api/notes/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'SELECT * FROM notes WHERE id = ?';
  db.get(sql, [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.json(row);
  });
});

// 8. POST /api/notes - Create a new note
app.post('/api/notes', (req, res) => {
  const { title, content } = req.body;
  // Simple validation
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }
  const sql = 'INSERT INTO notes (title, content) VALUES (?, ?)';
  db.run(sql, [title, content || ''], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    // On success, return the newly created note (with its id)
    res.status(201).json({
      id: this.lastID,
      title,
      content: content || ''
    });
  });
});

// 9. PUT /api/notes/:id - Update an existing note
app.put('/api/notes/:id', (req, res) => {
  const id = req.params.id;
  const { title, content } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }
  const sql = 'UPDATE notes SET title = ?, content = ? WHERE id = ?';
  db.run(sql, [title, content || '', id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Note not found' });
    }
    // Return the updated note (we fetch it again)
    db.get('SELECT * FROM notes WHERE id = ?', [id], (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(row);
    });
  });
});

// 10. DELETE /api/notes/:id - Delete a note
app.delete('/api/notes/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'DELETE FROM notes WHERE id = ?';
  db.run(sql, [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.json({ message: 'Note deleted successfully' });
  });
});

// 11. Start the server
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});