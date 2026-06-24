# SignUp-Web — MERN Authentication System

A full-stack authentication system built with **React + Node.js + Express + MongoDB + JWT**.

- **Frontend** lives on the `main` branch — React + Vite + Bootstrap
- **Backend** lives on the `sidhu` branch — Node.js + Express + MongoDB + JWT

---

## 🗂️ Project Structure

```
SignUp-web/
├── frontend/               ← React app (main branch)
│   ├── src/
│   │   ├── api.js          ← Axios instance (connects to backend)
│   │   ├── App.jsx
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── .env                ← VITE_API_URL=http://localhost:5000/api/v1
│   └── package.json
│
└── backend/                ← Express API (sidhu branch)
    ├── src/
    │   ├── config/
    │   ├── middleware/
    │   ├── modules/auth/
    │   ├── routes/
    │   ├── utils/
    │   ├── app.js
    │   └── server.js
    ├── .env                ← MONGO_URI, JWT secrets, PORT
    └── package.json
```

---

## ⚡ Quick Setup — Connect Frontend + Backend

Follow these steps exactly to run the full stack locally.

### Step 1 — Clone the repository

```bash
git clone https://github.com/GaddamBharathi123/SignUp-web.git
cd SignUp-web
```

---

### Step 2 — Get the backend from the `sidhu` branch

The backend code lives on a separate branch. Pull it into a `backend/` folder without switching away from `main`:

```bash
# Fetch all branches from remote
git fetch origin

# Check out only the backend folder from the sidhu branch
git checkout origin/sidhu -- backend/
```

> After this you will have both `frontend/` (from main) and `backend/` (from sidhu) in the same folder.

---

### Step 3 — Set up the Backend

#### 3a. Install dependencies

```bash
cd backend
npm install
```

#### 3b. Create the `.env` file

Create a file at `backend/.env` and fill in your values:

```env
PORT=5000
NODE_ENV=development

# Your MongoDB Atlas connection string
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/signup_web?retryWrites=true&w=majority

# Generate secrets by running:
# node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_ACCESS_SECRET=your_64_character_random_string_here
JWT_REFRESH_SECRET=another_64_character_random_string_here

JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

CORS_ORIGIN=http://localhost:5173
```

#### 3c. Set up MongoDB Atlas (if you haven't already)

1. Go to [https://www.mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register) and create a free account
2. Create a free **M0 cluster**
3. Create a **database user** with a username and password
4. Under **Network Access**, add your IP or use `0.0.0.0/0` for development
5. Click **Connect → Drivers → Node.js** and copy the connection string
6. Paste it into `backend/.env` as `MONGO_URI`, replacing `<username>` and `<password>`

#### 3d. Start the backend server

```bash
npm run dev
```

You should see:
```
🍃  MongoDB connected: cluster0.xxxxx.mongodb.net
✅  Server running on http://localhost:5000
```

---

### Step 4 — Set up the Frontend

Open a **new terminal** and go back to the project root:

```bash
cd ../frontend     # or wherever your frontend folder is
```

#### 4a. Install dependencies

```bash
npm install
```

#### 4b. Create the `.env` file

Create a file at `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api/v1
```

> This tells the React app where to send API requests. Must match the `PORT` in your backend `.env`.

#### 4c. Start the frontend

```bash
npm run dev
```

You should see:
```
  VITE v6.x.x  ready in xxx ms
  ➜  Local:   http://localhost:5173/
```

---

### Step 5 — Verify everything works

Open [http://localhost:5173](http://localhost:5173) in your browser.

| Action | Expected result |
|---|---|
| Open the app | Redirects to `/register` page |
| Fill in name, email, password and click **Register** | Success message → redirects to `/login` |
| Enter credentials and click **Login** | Logs in → redirects to `/dashboard` |
| Click **Login** on Register page | Navigates to `/login` |
| Click **Sign Up** on Login page | Navigates to `/register` |

---

## 🔌 API Endpoints

Base URL: `http://localhost:5000/api/v1`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/auth/register` | Public | Create a new account |
| POST | `/auth/login` | Public | Login and receive tokens |
| GET | `/auth/me` | Protected | Get logged-in user profile |
| POST | `/auth/logout` | Protected | Invalidate refresh token |
| POST | `/auth/refresh` | Public | Get new access token |

Protected routes require the header:
```
Authorization: Bearer <accessToken>
```

---

## 🛠️ Tech Stack

### Frontend
| Package | Version | Purpose |
|---|---|---|
| React | 19 | UI framework |
| Vite | 8 | Build tool |
| React Router DOM | 7 | Client-side routing |
| Axios | 1 | HTTP client |
| Bootstrap | 5 | Styling |

### Backend
| Package | Version | Purpose |
|---|---|---|
| Express | 4 | Web framework |
| Mongoose | 8 | MongoDB ODM |
| jsonwebtoken | 9 | JWT signing/verification |
| bcryptjs | 2 | Password hashing |
| express-validator | 7 | Request validation |
| cors | 2 | Cross-origin requests |
| dotenv | 16 | Environment variables |
| nodemon | 3 | Dev auto-restart |

---

## 🔐 Authentication Flow

```
Register:  Form → Validate → Hash password → Save to DB → Success

Login:     Form → Validate → Compare password → Sign tokens
               → Save refresh token to DB → Return tokens

Protected: Request → Bearer token → Verify JWT → Access granted

Refresh:   Refresh token → Verify → Rotate token → New access token

Logout:    Clear refresh token from DB → Session ended
```

---

## 🔒 Git Ignore

The following files are intentionally excluded from Git:

```text
backend/.env
backend/node_modules/
frontend/node_modules/
```

Never commit secrets or dependencies.

## 🌿 Branch Structure

| Branch | Contains | Run command |
|---|---|---|
| `main` | React frontend | `cd frontend && npm run dev` |
| `sidhu` | Express backend | `cd backend && npm run dev` |

---

## ❓ Troubleshooting

**Backend crashes on start**
- Check all files are in their correct locations (not merged into one file)
- Run `node -e "require('./src/middleware/error.middleware')" && echo OK` — must print `OK`
- Verify `backend/.env` exists and has `MONGO_URI`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`

**Cannot connect to MongoDB**
- Confirm your IP is whitelisted in Atlas Network Access
- Check the connection string has the correct username, password, and database name

**Frontend shows blank page or CORS error**
- Make sure `backend/.env` has `CORS_ORIGIN=http://localhost:5173`
- Make sure `frontend/.env` has `VITE_API_URL=http://localhost:5000/api/v1`
- Both servers must be running at the same time