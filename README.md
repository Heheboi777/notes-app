# Notes App – Full Stack CRUD Application

A simple note management system built with Vue.js, Express, and SQLite.  
Completed as a pre-task for the **Full Stack Web Developer Intern** position at **SuDu AI**.

---

## Live URLs

- **Frontend (Vercel)**: https://notes-app-green-phi.vercel.app/
- **Backend (Railway)**: https://notes-app-production-b54e.up.railway.app/api/notes

---

## Tech Stack

| Layer       | Technology                            |
|-------------|-------------------------------------  |
| Frontend    | Vue 3 + Vite + Axios                  |
| Backend     | Node.js + Express                     |
| Database    | SQLite (better-sqlite3)               |
| Deployment  | Vercel (frontend) + Railway (backend) |

---

## Features

- Create, Read, Update, Delete notes  
- All data persisted in SQLite database  
- Responsive UI with basic styling  

---

## How to Run Locally

### Prerequisites
- Node.js (v18 or higher)  
- npm (comes with Node.js)

### 1. Clone the repository
```bash```
1. git clone https://github.com/Heheboi777/notes-app.git
2. cd notes-app

### 2. Backend Setup

1. cd backend
2. npm install
3. node app.js

Server runs on http://localhost:3000

### 3. Frontend Setup

1. cd frontend
2. npm install
3. npm run dev

App runs on http://localhost:5173

### 4. Open the App 

Visit http://localhost:5173 in your browser.

Add, edit, or delete notes – all changes will be saved to the local SQLite database.

### AI Usage Examples (as required by the task)

Example 1 – Express CRUD routes

Prompt: “Write Express.js routes for a notes CRUD API with SQLite.”

AI output: Basic route skeletons with SQLite queries.

My modification: Added 404 handling, input validation, and proper status codes.

Reason: To meet RESTful conventions and provide clear feedback.

---

Example 2 – Vue.js form with Axios

Prompt: “Create a Vue 3 component with a form and a list, using axios for API calls.”

AI output: Template with v-model and axios calls.

My modification: Added async/await with try‑catch blocks, real‑time UI updates after each action.

Reason: To handle network errors gracefully and improve user experience.

---

Example 3 – SQLite deployment issue on Railway

Prompt: “sqlite3 invalid ELF header error on Railway deployment.”

AI output: Suggested switching from sqlite3 to better-sqlite3.

My modification: Replaced the driver in package.json and updated app.js syntax accordingly.

Reason: better-sqlite3 is more compatible with Railway's Linux environment and avoids compilation failures.

### Challenges Faced

1. SQLite native compilation on Railway → fixed by using better-sqlite3.

2. Vercel deployment path – selected only frontend as the root directory, backend remains on Railway.

3. Windows firewall initially blocked Node.js → allowed it through Defender Firewall.

### Future Improvements

- Add user authentication (login/register)

- Search / filter notes

- Tag/category support

- Move to a production database (PostgreSQL)

**Author**: Teoh Lip Sure – Full Stack Web Developer Intern Candidate  
**Submission Date**: 23 July 2026  
**Company**: SuDu AI
