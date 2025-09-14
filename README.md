# 🧠 Second Brain App

A full-stack web application designed to help users save, manage, and share useful content like tweets, YouTube videos, and links for future reference.

---

## 🚀 Features

- User Authentication (Sign Up / Sign In / Logout)
- Add content (YouTube, Tweets, Links)
- Filter content by type
- Generate shareable links to whole brain
- Responsive UI with Tailwind CSS
- Backend built with Express.js and MongoDB
- Frontend built with React + TypeScript
- State management with React Query

---

## 📂 Project Structure

```text
second-brain-app/
├── backend/        # Express.js API + MongoDB models + Authentication
├── frontend/       # React frontend with components & pages
├── .gitignore
├── README.md
└── package.json
```

---

## ⚡ Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, React Router  
- **Backend**: Express.js, MongoDB, JWT Authentication  
- **State Management**: React Query  
- **Version Control**: Git + GitHub  

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/second-brain-app.git
cd second-brain-app
```

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

#### Environment Variables

Create a `.env` file in the `backend/` folder with the following content:

```env
PORT=5000
MONGO_URL=your-mongodb-connection-url
JWT_SECRET=your-jwt-secret
BASE_URL=http://localhost:5000
```


### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
```

#### Environment Variables

Create a `.env` file in the `frontend/` folder with the following content:

```env
REACT_APP_BACKEND_URL=http://localhost:5000
```

## ❤️ Contribution

Feel free to open issues or submit pull requests if you find bugs or have suggestions to improve the project.  
Your contributions are always welcome!
