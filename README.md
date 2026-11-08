# 🎓 Smart Exam Notes Sharing Platform

A modern, full-stack MERN platform where students can share, discover and learn from exam notes — supercharged with AI summaries, quizzes, gamification, and a premium SaaS-grade UI.

## ✨ Features

### For Students
- 📤 Upload notes (PDF, DOC, images) with drag-and-drop
- 🔍 Powerful search & filter by subject, branch, semester, category
- 👁️ In-browser PDF preview powered by `react-pdf`
- ❤️ Like, bookmark, share & rate notes
- 💬 Comments and replies on notes
- 🤖 AI summaries, auto-quiz generation & important questions extraction
- 🏆 Badges, points & leaderboard for top contributors
- 🔔 Real-time notifications system
- 📊 Personal dashboard with stats and charts
- 📚 Recently viewed and download history

### For Admins
- 👥 Manage users (activate/deactivate, delete)
- 🛡️ Moderate content & flag inappropriate notes
- 📈 Comprehensive analytics dashboard
- 📊 Charts for uploads, users, top subjects, branches

### UI/UX
- 🌗 Dark mode & light mode (with persistent toggle)
- 🪟 Glassmorphism cards, gradients, smooth Framer Motion animations
- 📱 Fully responsive (mobile, tablet, desktop)
- 🎨 Sidebar navigation with icons + premium SaaS look (inspired by Notion, Linear, Discord)
- ⚡ Loading skeletons & toast notifications

---

## 🛠 Tech Stack

| Layer        | Technology                                          |
|--------------|-----------------------------------------------------|
| Frontend     | React 18, Vite, Tailwind CSS, Framer Motion         |
| State        | React Context, Zustand                              |
| Charts       | Recharts                                            |
| PDF Preview  | react-pdf                                           |
| Forms        | React Hook Form, react-dropzone                     |
| Backend      | Node.js, Express.js                                 |
| Database     | MongoDB + Mongoose                                  |
| Auth         | JWT + bcrypt                                        |
| File Upload  | Multer + Cloudinary                                 |
| Notifications| react-hot-toast                                     |

---

## 📁 Project Structure

```
smart-exam-notes/
├── backend/
│   ├── config/          # DB & Cloudinary config
│   ├── controllers/     # Route handlers
│   ├── middleware/      # auth, upload, error handler
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Express routes
│   ├── uploads/         # Temporary file storage
│   ├── .env.example
│   ├── package.json
│   └── server.js
└── frontend/
    ├── src/
    │   ├── components/  # Reusable UI components
    │   ├── context/     # Theme & Auth contexts
    │   ├── layouts/     # Public & Dashboard layouts
    │   ├── pages/       # Route pages (Home, Dashboard, etc.)
    │   ├── utils/       # api client, constants
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── tailwind.config.js
    ├── vite.config.js
    └── package.json
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Cloudinary account (free tier works)

### 1. Clone the repo
```bash
git clone <your-repo-url>
cd smart-exam-notes
```

### 2. Backend setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secret, Cloudinary keys
npm run dev   # Starts on http://localhost:5000
```

### 3. Frontend setup
```bash
cd ../frontend
npm install
cp .env.example .env
npm run dev   # Starts on http://localhost:3000
```

### 4. Open browser
Visit `http://localhost:3000` and create an account!

---

## 🔑 Environment Variables

### Backend `.env`
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/smart-notes
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
FRONTEND_URL=http://localhost:3000
```

### Frontend `.env`
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 📊 MongoDB Sample Schema (Note)

```js
{
  title: String,
  description: String,
  subject: String,
  branch: "CSE" | "IT" | "ECE" | ...,
  semester: 1..8,
  category: "Lecture Notes" | "Previous Year Papers" | ...,
  tags: [String],
  file: { url, publicId, format, size, originalName },
  uploadedBy: ObjectId(User),
  downloads: Number,
  views: Number,
  likes: [ObjectId(User)],
  bookmarks: [ObjectId(User)],
  ratings: [{ user, rating, createdAt }],
  averageRating: Number,
  aiSummary: String,
  aiQuiz: [{ question, options, correctAnswer }],
  importantQuestions: [String],
  isApproved: Boolean,
  isFlagged: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔌 API Endpoints (Highlights)

- `POST   /api/auth/register` — Register new user
- `POST   /api/auth/login` — Login
- `GET    /api/auth/me` — Current user
- `GET    /api/notes` — List notes (search, filter, sort)
- `POST   /api/notes` — Upload note (auth)
- `GET    /api/notes/:id` — Get single note
- `PUT    /api/notes/:id/like` — Like/unlike
- `PUT    /api/notes/:id/bookmark` — Bookmark
- `POST   /api/notes/:id/rate` — Rate note
- `POST   /api/ai/summary/:noteId` — AI summary
- `GET    /api/analytics/overview` — Admin dashboard data
- `GET    /api/users/leaderboard` — Top contributors

---

## 🧑‍💻 Make a user Admin

After registering, manually update the user document in MongoDB:
```js
db.users.updateOne({ email: 'you@email.com' }, { $set: { role: 'admin' } })
```

## 📜 License
MIT — Free for personal & educational use.
