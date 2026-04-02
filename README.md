# 🎙️ Online Podcast Manager
### IFN636 - Software Life Cycle Management | Assessment 1.2
**Student:** Lejan Daniel I. Perdio
**Student ID:** 12691429

---

## 📌 Project Overview

An Online Podcast Manager built with the MERN stack (MongoDB, Express, React, Node.js).
The system supports core functionalities such as creating, viewing, updating, and deleting
podcast episodes through an administrative interface, while allowing users to browse,
search, and play podcast content.

---

## 🚀 Features

- ✅ User Authentication (Register, Login, Logout)
- ✅ Create, Read, Update, Delete podcast episodes
- ✅ Category management
- ✅ Audio playback
- ✅ Search and filter episodes
- ✅ Admin dashboard
- ✅ CI/CD pipeline with GitHub Actions
- ✅ Deployed on AWS EC2

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| Auth | JWT (JSON Web Tokens) |
| Deployment | AWS EC2 |
| CI/CD | GitHub Actions |

---

## ⚙️ Project Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Git

### 1. Clone the repository
```bash
git clone https://github.com/liperdio/sampleapp_IFQ636.git
cd sampleapp_IFQ636
```

### 2. Setup Backend
```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

Start the backend:
```bash
npm start
```

### 3. Setup Frontend
```bash
cd frontend
npm install
npm start
```

### 4. Open the app
```
http://localhost:3000
```

---

## 🌐 Public URL
```
http://YOUR_EC2_IP_ADDRESS
```
*(To be updated after EC2 deployment)*

---

## 🔑 Test Credentials

| Role | Username | Password |
|---|---|---|
| Admin | admin@podcast.com | Admin1234! |
| User | user@podcast.com | User1234! |

---

## 🔗 GitHub Repository
```
https://github.com/liperdio/sampleapp_IFQ636
```

---

## 📦 Branch Structure

| Branch | Purpose |
|---|---|
| `main` | Production ready code |
| `feature/podcast-model` | MongoDB models |
| `feature/category-model` | Category model |
| `feature/podcast-backend-api` | Backend API routes |
| `feature/podcast-frontend-crud` | Frontend pages |
| `feature/audio-playback` | Audio player |
| `feature/cicd-pipeline` | CI/CD pipeline |

---

## 🔄 CI/CD Pipeline

- **CI** — Runs on every push: installs dependencies and builds frontend
- **CD** — Runs on merge to main: deploys to AWS EC2 via SSH

---

## 📚 References

- Bonini, T. (2015). The second age of podcasting. *Quaderns del CAC*, 18(41), 21–30.
- Sullivan, J. L. (2019). The platforms of podcasting. *Social Media + Society*, 5(4).
- Sommerville, I. (2016). *Software engineering* (10th ed.). Pearson.