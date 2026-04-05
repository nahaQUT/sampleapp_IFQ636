# 📚 LearnShare — Learning Resource Sharing Platform

A full-stack CRUD web application built with the **MERN stack** (MongoDB, Express, React, Node.js) that allows students to share and discover learning resources. The platform supports two user roles — **Admin** and **User** — with role-based access control throughout.

---

## 🚀 Features

### General
- Browse all shared learning resources without logging in
- Filter resources by category (Article, Video, Book, Course, Other)
- View resource details including subject, description and external links

### Normal User
- Register and login securely with JWT authentication
- Share new learning resources with the community
- Edit and delete their own shared resources
- Update their profile (name, email, university, address)

### Admin
- Delete any resource posted by any user
- Access the Admin Dashboard with:
    - Total user count
    - Total resource count
    - List of recent resources
    - List of recent users (with ability to delete users)

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, Tailwind CSS, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT (JSON Web Tokens), bcrypt |
| Deployment | AWS EC2, PM2, GitHub Actions (CI/CD) |

---

## 📁 Project Structure

```
sampleapp_IFQ636/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js      # Register, login, profile
│   │   └── resourceController.js  # CRUD for resources
│   ├── middleware/
│   │   ├── authMiddleware.js      # JWT protect middleware
│   │   └── adminMiddleware.js     # Admin only middleware
│   ├── models/
│   │   ├── User.js                # User schema
│   │   └── Resource.js            # Resource schema
│   ├── routes/
│   │   ├── authRoutes.js          # Auth endpoints
│   │   ├── resourceRoutes.js      # Resource endpoints
│   │   └── adminRoutes.js         # Admin endpoints
│   └── server.js                  # Express app entry point
│
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── ResourceForm.jsx
│       │   └── ResourceList.jsx
│       ├── context/
│       │   └── AuthContext.js     # Global auth state
│       ├── pages/
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── Profile.jsx
│       │   ├── Resources.jsx
│       │   └── AdminDashboard.jsx
│       ├── App.js
│       └── axiosConfig.js
│
├── .github/
│   └── workflows/
│       └── ci.yml                 # GitHub Actions CI/CD
└── package.json
```

---

## ⚙️ Getting Started

### Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v20 LTS recommended)
- [MongoDB](https://www.mongodb.com/) or a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account
- [Git](https://git-scm.com/)

### 1. Clone the repository

```bash
git clone https://github.com/Jisan129/sampleapp_IFQ636.git
cd sampleapp_IFQ636
```

### 2. Set up environment variables

Create a `.env` file inside the `backend/` folder:

```bash
touch backend/.env
```

Add the following:

```env
PORT=5001
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/learnshare?retryWrites=true&w=majority
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

### 3. Install all dependencies

```bash
npm run install-all
```

### 4. Run the application

```bash
npm run dev
```

- Frontend → http://localhost:3000
- Backend API → http://localhost:5001

---

## 🔌 API Endpoints

### Auth Routes — `/api/auth`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Register a new user | ❌ |
| POST | `/api/auth/login` | Login and get JWT token | ❌ |
| GET | `/api/auth/profile` | Get current user profile | ✅ |
| PUT | `/api/auth/profile` | Update current user profile | ✅ |

### Resource Routes — `/api/resources`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/resources` | Get all resources | ❌ |
| GET | `/api/resources/:id` | Get single resource | ❌ |
| POST | `/api/resources` | Create new resource | ✅ |
| PUT | `/api/resources/:id` | Update resource (owner only) | ✅ |
| DELETE | `/api/resources/:id` | Delete resource (owner or admin) | ✅ |

### Admin Routes — `/api/admin`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/admin/dashboard` | Get dashboard stats | ✅ Admin only |
| DELETE | `/api/admin/users/:id` | Delete a user | ✅ Admin only |

---

## 👥 User Roles

| Feature | Guest | User | Admin |
|---|---|---|---|
| View all resources | ✅ | ✅ | ✅ |
| Create resource | ❌ | ✅ | ✅ |
| Edit own resource | ❌ | ✅ | ✅ |
| Delete own resource | ❌ | ✅ | ✅ |
| Delete any resource | ❌ | ❌ | ✅ |
| Access dashboard | ❌ | ❌ | ✅ |
| Delete users | ❌ | ❌ | ✅ |

User Credentials
---
User: user123@gmail.com
password: 123456

Admin: jisananam1228@gmail.com
password: 12321434231
## 🔐 Setting Up an Admin User

1. Register a new account via the app or Postman
2. Go to **MongoDB Atlas** → Browse Collections → `users`
3. Find your user and edit the document:
```json
{
  "$set": {
    "role": "admin"
  }
}
```
4. Log out and log back in — you will now have admin access

---

## 🚀 CI/CD Deployment

This project uses **GitHub Actions** with a **self-hosted runner** on AWS EC2 for automated deployment.

Every push to the `main` branch triggers the workflow which:
1. Checks out the latest code
2. Installs Node.js
3. Installs all dependencies
4. Restarts the backend with PM2
5. Builds the frontend

### Setting up the self-hosted runner

```bash
# On your AWS EC2 instance
mkdir actions-runner && cd actions-runner
curl -o actions-runner-linux-x64.tar.gz -L <runner-download-url>
tar xzf ./actions-runner-linux-x64.tar.gz
./config.sh --url https://github.com/<your-repo> --token <your-token>
sudo ./svc.sh install
sudo ./svc.sh start
```

---

## 📦 Resource Categories

Resources can be shared under the following categories:

- 📄 **Article** — Blog posts, papers, written guides
- 🎥 **Video** — YouTube, lectures, tutorials
- 📖 **Book** — Textbooks, eBooks, reading material
- 🎓 **Course** — Online courses, structured learning
- 🔖 **Other** — Anything that doesn't fit above

---

## 🖥️ Screenshots

| Page | Description |
|---|---|
| `/resources` | Browse and share learning resources |
| `/login` | Clean black & white login page |
| `/register` | Create a new account |
| `/profile` | View and update your profile |
| `/admin` | Admin dashboard with stats |

---

## 👨‍💻 Author

**Jisan** — [@Jisan129](https://github.com/Jisan129)

---

## 📄 License

This project was developed as part of **IFQ636 Assessment** at **QUT (Queensland University of Technology)**.