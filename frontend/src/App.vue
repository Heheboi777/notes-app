<template>
  <div id="app">
    <h1>📝 My Notes</h1>

    <!-- Form to add / edit a note -->
    <div class="note-form">
      <input v-model="currentNote.title" placeholder="Note title" />
      <textarea v-model="currentNote.content" placeholder="Note content" rows="3"></textarea>
      <button @click="saveNote">
        {{ isEditing ? 'Update' : 'Add' }} Note
      </button>
      <button v-if="isEditing" @click="cancelEdit" class="cancel">Cancel</button>
    </div>

    <!-- List of notes -->
    <div class="notes-list">
      <div v-for="note in notes" :key="note.id" class="note-card">
        <h3>{{ note.title }}</h3>
        <p>{{ note.content }}</p>
        <div class="actions">
          <button @click="editNote(note)">✏️ Edit</button>
          <button @click="deleteNote(note.id)">🗑️ Delete</button>
        </div>
      </div>
      <p v-if="notes.length === 0" class="empty">No notes yet. Add one above!</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

// Use your backend URL (change to your Railway URL later)
const API_BASE = 'http://localhost:3000/api/notes';

export default {
  data() {
    return {
      notes: [],
      currentNote: { title: '', content: '' },
      isEditing: false
    };
  },
  methods: {
    async fetchNotes() {
      try {
        const response = await axios.get(API_BASE);
        this.notes = response.data;
      } catch (error) {
        console.error('Error fetching notes:', error);
        alert('Failed to load notes. Is backend running?');
      }
    },
    async saveNote() {
      const { title, content } = this.currentNote;
      if (!title.trim()) {
        alert('Title is required');
        return;
      }
      try {
        if (this.isEditing) {
          const response = await axios.put(`${API_BASE}/${this.currentNote.id}`, {
            title,
            content
          });
          const index = this.notes.findIndex(n => n.id === response.data.id);
          if (index !== -1) {
            this.notes.splice(index, 1, response.data);
          }
          this.cancelEdit();
        } else {
          const response = await axios.post(API_BASE, { title, content });
          this.notes.unshift(response.data);
          this.currentNote = { title: '', content: '' };
        }
      } catch (error) {
        console.error('Error saving note:', error);
        alert('Failed to save note.');
      }
    },
    editNote(note) {
      this.currentNote = { ...note };
      this.isEditing = true;
      document.querySelector('.note-form').scrollIntoView({ behavior: 'smooth' });
    },
    cancelEdit() {
      this.currentNote = { title: '', content: '' };
      this.isEditing = false;
    },
    async deleteNote(id) {
      if (!confirm('Are you sure you want to delete this note?')) return;
      try {
        await axios.delete(`${API_BASE}/${id}`);
        this.notes = this.notes.filter(n => n.id !== id);
      } catch (error) {
        console.error('Error deleting note:', error);
        alert('Failed to delete note.');
      }
    }
  },
  mounted() {
    this.fetchNotes();
  }
};
</script>

<style scoped>
#app {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}
.note-form {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}
.note-form input, .note-form textarea {
  width: 100%;
  padding: 8px;
  margin: 6px 0;
  box-sizing: border-box;
}
.note-form button {
  margin-right: 10px;
  padding: 8px 16px;
}
.cancel {
  background: #ccc;
}
.notes-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.note-card {
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 8px;
  background: white;
}
.note-card h3 {
  margin: 0 0 8px 0;
}
.note-card .actions button {
  margin-right: 8px;
}
.empty {
  color: #888;
  text-align: center;
  margin-top: 30px;
}
</style>