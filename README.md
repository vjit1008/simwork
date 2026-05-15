<div align="center">

<img src="https://img.shields.io/badge/SimWork-Simulate%20Before%20You%20Apply-7C6EFA?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHRleHQgeT0iMjAiIGZvbnQtc2l6ZT0iMjAiPvCfkqE8L3RleHQ+PC9zdmc+" />

# SimWork

### 🎯 Simulate Before You Apply

**AI-powered job simulation platform that bridges the gap between education and employment.**

[![Live Demo](https://img.shields.io/badge/Live-simwork.vercel.app-34D399?style=flat-square&logo=vercel)](https://simwork.vercel.app)
[![License](https://img.shields.io/badge/License-Custom-F59E0B?style=flat-square)](./LICENSE)
[![Built With](https://img.shields.io/badge/Built%20With-React%20%2B%20Node.js-7C6EFA?style=flat-square&logo=react)](https://simwork.vercel.app)
[![AI](https://img.shields.io/badge/AI-Gemini%202.0-4285F4?style=flat-square&logo=google)](https://simwork.vercel.app)

</div>

---

## 🚀 What is SimWork?

SimWork is a full-stack job simulation platform where students experience **real work before they apply**. Instead of theory, students complete actual tasks — writing APIs, analysing data, building financial models — inside a browser-based IDE, get **AI feedback powered by Gemini**, earn XP, and collect **verified certificates** recruiters trust.

> 51.25% of Indian graduates are unemployable (NASSCOM 2024).  
> SimWork fixes that — one simulation at a time.

---

## ✨ Features

| Feature | Description |
|---|---|
| 💻 **4 Job Tracks** | Software Dev · Data Science · Finance Analyst · AI Engineer |
| 🎯 **3-Stage Difficulty** | Beginner → Intermediate → Hard with real IDE tasks |
| 🤖 **Gemini AI** | Hints, code review, rank insights, project idea generation |
| 🏅 **Verified Certificates** | Shareable proof of skills employers trust |
| 📊 **Live Leaderboard** | XP-based ranking with AI personalised climb advice |
| 🔁 **Workflow Engine** | Team projects with push / pull / review cycles |
| 💬 **Teamwork Chat** | Real-time channels organised by project and department |
| 🔐 **Auth + Roles** | Student · Mentor · Admin with JWT authentication |

---

## 🛠️ Tech Stack

### Frontend
- **React 18** + Vite
- **React Router v6**
- **Axios** for API calls
- **Google Gemini 2.0 Flash** API
- Deployed on **Vercel**

### Backend
- **Node.js** + **Express**
- **MongoDB Atlas** + **Mongoose**
- **JWT** Authentication
- **bcryptjs** password hashing
- Deployed on **Render**

---

## 📁 Project Structure

simwork/
├── backend/
│   ├── controllers/        # Auth, Project, User, Channel, Notification
│   ├── middleware/         # Auth, Role, Error handlers
│   ├── models/             # User, Project, Interview, Credit, Channel
│   ├── routes/             # All API routes
│   └── server.js           # Express entry point
│
├── frontend/
│   ├── src/
│   │   ├── api/            # Axios instance + Gemini API
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # Auth + Sim context
│   │   ├── pages/          # Dashboard, Simulations, Leaderboard, etc.
│   │   └── styles/         # Global CSS
│   └── index.html
│
└── README.md

---

## 🔌 API Endpoints

### Auth
POST   /api/auth/signup       Register new user
POST   /api/auth/login        Login + get JWT token

### Users
GET    /api/users/me          Get current user profile
PUT    /api/users/me          Update profile

### Projects
GET    /api/projects          Get all / assigned projects
POST   /api/projects          Create project (admin)
GET    /api/projects/:id      Get single project
POST   /api/projects/:id/push       Push work to next dept
POST   /api/projects/:id/pullback   Send back for revision
GET    /api/projects/:id/workflow   Get workflow history

### Interview
GET    /api/interview/questions     Get HR questions
POST   /api/interview/submit        Submit answers + get AI score
GET    /api/interview/result/:id    Get result
GET    /api/interview/history       Get past interviews

### Communication
GET    /api/channels          Get user channels
POST   /api/channels          Create channel
GET    /api/channels/:id      Get messages
POST   /api/channels/:id/message   Send message

### Notifications
GET    /api/notifications     Get notifications
PATCH  /api/notifications/read  Mark all as read

---

## ⚙️ Local Setup

### Prerequisites
- Node.js 20+
- MongoDB Atlas account
- Google Gemini API key (free at [aistudio.google.com](https://aistudio.google.com))

### 1. Clone the repo
```bash
git clone https://github.com/vjit1008/simwork.git
cd simwork
```

### 2. Backend setup
```bash
cd backend
npm install
```

Create `backend/.env`:
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

```bash
npm run dev
```

### 3. Frontend setup
```bash
cd ../frontend
npm install
```

Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000
VITE_GEMINI_API_KEY=your_gemini_api_key
```

```bash
npm run dev
```

### 4. Open in browser
http://localhost:5173

---

## 🌍 Deployment

| Service | Purpose | URL |
|---|---|---|
| Vercel | Frontend hosting | simwork.vercel.app |
| Render | Backend API | simwork.onrender.com |
| MongoDB Atlas | Database | cloud.mongodb.com |

---

## 🗺️ Roadmap

- [x] Authentication (JWT + roles)
- [x] 4 simulation tracks with IDE
- [x] Gemini AI integration
- [x] HR interview simulation
- [x] Project workflow engine
- [x] Teamwork chat channels
- [x] Leaderboard with AI insights
- [ ] Mobile app (iOS + Android)
- [ ] Employer dashboard
- [ ] College partnership API
- [ ] Real-time notifications (WebSocket)
- [ ] LinkedIn certificate sharing

---

## 👤 Author

**Vishvajit Gadakari**  
🌐 [simwork.vercel.app](https://simwork.vercel.app)  
📧 vjit1008@simwork.in  
🐙 [@vjit1008](https://github.com/vjit1008)

---

## 📄 License

Copyright © 2025 Vishvajit Gadakari — SimWork  
Unauthorized commercial use is prohibited. See [LICENSE](./LICENSE) for details.

---

<div align="center">

**⭐ Star this repo if SimWork helped you — it means a lot!**

*Built with ❤️ in Pune, India*

</div>