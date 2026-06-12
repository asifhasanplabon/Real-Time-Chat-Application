# 💬 Real-Time Chat Application

A modern full-stack real-time chat application built with the MERN stack and Socket.IO, featuring secure JWT authentication, real-time messaging, typing indicators, online presence tracking, protected routes, and responsive user experience.

## 🚀 Live Demo

**Frontend:** https://real-time-chat-asif-hasan.netlify.app/chat

**Backend API:** https://real-time-chat-application-skjn.onrender.com

---

## 📖 Overview

This project demonstrates the implementation of a scalable real-time communication system using WebSockets and REST APIs. Users can register, authenticate securely, join chat rooms, exchange messages instantly, view online users, and receive typing status updates in real time.

The application follows a modern client-server architecture with React on the frontend and Express.js on the backend, connected through Socket.IO for bidirectional communication.

---

## ✨ Key Features

### Authentication & Security

* Secure JWT Authentication
* HTTP-Only Cookie Based Sessions
* Protected Client Routes
* Protected API Endpoints
* Password Hashing with bcryptjs

### Real-Time Communication

* Instant Messaging
* Socket.IO Powered Communication
* Typing Indicators
* Online/Offline Presence Detection
* Real-Time Room Updates
* Read Receipts

### User Experience

* Responsive Design
* Modern Chat Interface
* Dynamic Room Management
* User Profile Management
* Persistent Authentication State

---

## 🛠️ Technology Stack

### Frontend

* React.js
* Vite
* React Router DOM
* Axios
* Socket.IO Client
* Context API
* Tailwind CSS

### Backend

* Node.js
* Express.js
* Socket.IO
* MongoDB Atlas
* Mongoose
* JWT Authentication
* bcryptjs
* cookie-parser
* CORS

### Deployment

* Netlify (Frontend)
* Render (Backend)
* MongoDB Atlas (Database)

---

## 🏗️ System Architecture

```text
┌─────────────┐
│   React UI  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Axios REST  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Express API │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ MongoDB     │
└─────────────┘

       ▲
       │
       ▼

┌─────────────┐
│ Socket.IO   │
└─────────────┘
```

---

## 📂 Project Structure

```text
Real-Time-Chat-Application
│
├── backend
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── socket
│   ├── server.js
│   └── package.json
│
└── frontend
    ├── public
    ├── src
    │   ├── components
    │   ├── pages
    │   ├── context
    │   ├── hooks
    │   ├── services
    │   ├── App.jsx
    │   └── main.jsx
    └── package.json
```

---

## 🔌 REST API Endpoints

### Authentication

| Method | Endpoint           | Description      |
| ------ | ------------------ | ---------------- |
| POST   | /api/auth/register | Register User    |
| POST   | /api/auth/login    | Login User       |
| POST   | /api/auth/logout   | Logout User      |
| GET    | /api/auth/me       | Get Current User |

### Rooms

| Method | Endpoint                   | Description     |
| ------ | -------------------------- | --------------- |
| GET    | /api/rooms                 | Get All Rooms   |
| POST   | /api/rooms                 | Create Room     |
| GET    | /api/rooms/:roomId         | Get Single Room |
| PATCH  | /api/rooms/:roomId/members | Add Members     |

### Messages

| Method | Endpoint                 | Description       |
| ------ | ------------------------ | ----------------- |
| GET    | /api/messages/:roomId    | Get Room Messages |
| POST   | /api/messages            | Send Message      |
| DELETE | /api/messages/:messageId | Delete Message    |

---

## ⚡ Socket Events

| Event           | Purpose                |
| --------------- | ---------------------- |
| user_online     | User Presence Tracking |
| join_rooms      | Join Chat Rooms        |
| send_message    | Send New Message       |
| receive_message | Receive Message        |
| typing_start    | Start Typing           |
| typing_stop     | Stop Typing            |
| user_typing     | Typing Status          |
| presence_update | Online Status Update   |
| mark_read       | Message Read Receipt   |

---

## ⚙️ Local Development Setup

### Prerequisites

* Node.js 18+
* MongoDB Atlas
* Git

### Clone Repository

```bash
git clone https://github.com/asifhasanplabon/Real-Time-Chat-Application.git
cd Real-Time-Chat-Application
```

---

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

Run Backend:

```bash
npm run dev
```

---

### Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

Run Frontend:

```bash
npm run dev
```

---

## 📈 What I Learned

* Designing RESTful APIs
* Implementing JWT Authentication
* Managing Real-Time Events with Socket.IO
* Building Protected Routes
* State Management with Context API
* MongoDB Data Modeling
* Full-Stack Deployment Workflows
* Client-Server Communication Patterns

---

## 🎯 Future Improvements

* Group Video Calling
* File & Image Sharing
* Message Reactions
* Push Notifications
* Voice Messages
* User Blocking System
* Chat Search Functionality
* Message Encryption

---

## 👨‍💻 Author

### Asif Hasan

Junior Software Engineer

* GitHub: https://github.com/asifhasanplabon
* LinkedIn: https://linkedin.com/in/asifhasanplabon
* Email: [ahplabon36@gmail.com](mailto:ahplabon36@gmail.com)

---

## ⭐ Support

If you found this project useful, consider giving it a star on GitHub. It helps others discover the project and supports future development.
