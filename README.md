# Streaming Watchlist Manager
A full‑stack CRUD application built for IFN636 – Software Life Cycle Management.  
This project implements user watchlists, content catalog management, authentication, and a full CI/CD deployment pipeline using GitHub Actions and AWS EC2.

---

## Live Application  
Public URL: http://13.239.233.85

---

## Tech Stack  
### Backend
- Node.js  
- Express.js  
- MongoDB (Mongoose)  
- JWT Authentication  
- Jest + Supertest (Testing)

### Frontend
- React.js  
- React Router  
- Axios  
- Protected Routes (JWT)

### DevOps
- GitHub Actions (CI/CD)  
- Self‑hosted EC2 Runner  
- PM2 Process Manager  
- AWS EC2 (Ubuntu 24.04)

---

## Test Credentials

### Admin
Email: admin@test.com  
Password: admin1234

### Regular User
Email: nithishnani072@gmail.com  
Password: Nithish2003

---

## Project Structure

```
sampleapp_IFQ636/
│
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Watchlist.js
│   │   ├── WatchlistItem.js
│   │   └── Content.js
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── tests/
│   └── server.js
│
├── frontend/
│   ├── src/pages/
│   ├── src/components/
│   └── src/App.jsx
│
└── .github/workflows/ci.yml
```

---

## Running the Project Locally

### Backend
```bash
cd backend
npm install
cp .env.example .env
npm start
```

### Frontend
```bash
cd frontend
npm install
npm start
```

---

## CI/CD Pipeline (GitHub Actions to EC2)

This project uses a self‑hosted EC2 runner to automatically deploy updates.

### Pipeline Steps:
1. Install dependencies  
2. Run tests  
3. Build frontend  
4. SSH into EC2  
5. Pull latest code  
6. Restart PM2 process  

### Required GitHub Secrets:
- EC2_HOST  
- EC2_USER  
- EC2_KEY  
- MONGO_URI  
- JWT_SECRET  

---

## PM2 Commands (EC2)
```bash
pm2 start server.js --name watchlist-app
pm2 restart watchlist-app
pm2 logs watchlist-app
pm2 status
```

---

## Features

### User Features
- Register and Login  
- Create watchlists  
- Add titles to watchlists  
- Update status (Watched, Watching, Pending)  
- Delete watchlists or items  

### Admin Features
- Add new content titles  
- Edit content metadata  
- Delete titles  
- View catalog with filters  

---

## Branching Strategy

Feature branches used:
- feature/backend-models  
- feature/backend-routes  
- feature/frontend-pages  
- feature/tests  
- feature/cicd-config  

Each branch was merged into the main branch through pull requests.

---

## License
This project was developed for educational purposes as part of IFN636 at QUT.
