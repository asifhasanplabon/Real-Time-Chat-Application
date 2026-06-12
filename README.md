**`README.md`**

```markdown
# Real-Time Chat Application

A full-stack real-time chat application built with the MERN stack and WebSockets, featuring live messaging, user presence detection, and JWT authentication.

**Live Demo:** [real-time-chat-asif-hasan.netlify.app](https://real-time-chat-asif-hasan.netlify.app/chat)  
**Backend API:** [real-time-chat-application-skjn.onrender.com](https://real-time-chat-application-skjn.onrender.com)

---

## Features

- Real-time messaging with Socket.IO
- User presence (online/offline status)
- Typing indicator
- JWT authentication with HTTP-only cookies
- Private and group chat rooms
- Message read receipts
- Responsive UI with Tailwind CSS
- Protected routes

---

## Tech Stack

### Frontend
- React.js (Vite)
- Socket.IO Client
- Axios
- React Router DOM
- Tailwind CSS
- Context API

### Backend
- Node.js
- Express.js
- Socket.IO
- MongoDB + Mongoose
- JSON Web Token (JWT)
- bcryptjs
- cookie-parser
- CORS

---

## Project Structure

```
Real-Time-Chat-Application/
├── backend/
│   ├── config/
│   │   ├── db.js
│   │   └── socket.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── message.controller.js
│   │   └── room.controller.js
│   ├── middleware/
│   │   └── auth.middleware.js
│   ├── models/
│   │   ├── User.model.js
│   │   ├── Message.model.js
│   │   └── Room.model.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── message.routes.js
│   │   └── room.routes.js
│   ├── socket/
│   │   └── chatEvents.js
│   ├── .env
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── public/
    │   └── _redirects
    ├── src/
    │   ├── components/
    │   │   ├── MessageInput.jsx
    │   │   ├── MessageList.jsx
    │   │   ├── OnlineBadge.jsx
    │   │   ├── ProtectedRoute.jsx
    │   │   ├── Sidebar.jsx
    │   │   ├── TypingIndicator.jsx
    │   │   └── UserAvatar.jsx
    │   ├── context/
    │   │   ├── AuthContext.jsx
    │   │   ├── ChatContext.jsx
    │   │   └── SocketContext.jsx
    │   ├── hooks/
    │   │   ├── useAuth.js
    │   │   ├── useMessages.js
    │   │   └── useSocket.js
    │   ├── pages/
    │   │   ├── ChatPage.jsx
    │   │   ├── LoginPage.jsx
    │   │   ├── NotFoundPage.jsx
    │   │   ├── ProfilePage.jsx
    │   │   └── RegisterPage.jsx
    │   ├── services/
    │   │   ├── api.js
    │   │   ├── auth.service.js
    │   │   └── message.service.js
    │   ├── App.jsx
    │   └── main.jsx
    ├── .env
    └── package.json
```

---

## API Endpoints

### Auth
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | নতুন অ্যাকাউন্ট তৈরি | ❌ |
| POST | `/api/auth/login` | লগইন | ❌ |
| POST | `/api/auth/logout` | লগআউট | ❌ |
| GET | `/api/auth/me` | লগইন করা ইউজারের তথ্য | ✅ |

### Rooms
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/rooms` | সব রুম দেখা | ✅ |
| POST | `/api/rooms` | নতুন রুম তৈরি | ✅ |
| GET | `/api/rooms/:roomId` | নির্দিষ্ট রুম দেখা | ✅ |
| PATCH | `/api/rooms/:roomId/members` | মেম্বার যোগ করা | ✅ |

### Messages
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/messages/:roomId` | রুমের মেসেজ দেখা | ✅ |
| POST | `/api/messages` | মেসেজ পাঠানো | ✅ |
| DELETE | `/api/messages/:messageId` | মেসেজ মুছা | ✅ |

---

## Socket Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `user_online` | Client → Server | ইউজার অনলাইন হলে |
| `join_rooms` | Client → Server | রুমে যোগ দেওয়া |
| `send_message` | Client → Server | মেসেজ পাঠানো |
| `receive_message` | Server → Client | মেসেজ পাওয়া |
| `typing_start` | Client → Server | টাইপিং শুরু |
| `typing_stop` | Client → Server | টাইপিং বন্ধ |
| `user_typing` | Server → Client | কেউ টাইপ করছে |
| `presence_update` | Server → Client | অনলাইন স্ট্যাটাস আপডেট |
| `mark_read` | Client → Server | মেসেজ পড়া হয়েছে |

---

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Git

### Installation

**১. Repository clone করুন**
```bash
git clone https://github.com/asifhasanplabon/Real-Time-Chat-Application.git
cd Real-Time-Chat-Application
```

**২. Backend setup**
```bash
cd backend
npm install
```

`backend/.env` ফাইল তৈরি করুন:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/chatapp
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

```bash
npm run dev
```

**৩. Frontend setup**
```bash
cd frontend
npm install
```

`frontend/.env` ফাইল তৈরি করুন:
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

```bash
npm run dev
```

---

## Deployment

| Service | Platform | URL |
|---------|----------|-----|
| Frontend | Netlify | [real-time-chat-asif-hasan.netlify.app](https://real-time-chat-asif-hasan.netlify.app) |
| Backend | Render | [real-time-chat-application-skjn.onrender.com](https://real-time-chat-application-skjn.onrender.com) |
| Database | MongoDB Atlas | Cloud Hosted |

---

## Author

**Asif Hasan**  
Junior Software Engineer  
📧 ahplabon36@gmail.com  
📍 Dhaka, Bangladesh  
🔗 [GitHub](https://github.com/asifhasanplabon) · [LinkedIn](https://linkedin.com/in/asifhasanplabon) · [LeetCode](https://leetcode.com/asifhasanplabon)
```
