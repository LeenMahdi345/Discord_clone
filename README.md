# 💬 Discord Clone

A real-time chat application inspired by Discord, built with **React, Node.js, Express, MongoDB, and Socket.IO**.

---

## 🚀 Features

- 🔐 User Authentication (Register / Login)
- 🪪 JWT-based secure login
- 💬 Real-time chat with Socket.IO
- 📢 Multiple chat channels (General / Gaming / Music)
- 🗄️ Messages stored in MongoDB
- ⬇️ Auto-scroll to latest messages
- 🎨 Discord-style UI design
- 🚪 Logout functionality

---

## 🛠️ Tech Stack

### 🎯 Frontend
- ⚛️ React
- 🌐 React Router DOM
- 📡 Axios
- 🔌 Socket.IO Client
- 🎨 CSS3

### ⚙️ Backend
- 🟢 Node.js
- 🚀 Express.js
- 🍃 MongoDB + Mongoose
- 🔌 Socket.IO
- 🔐 JWT Authentication
- 🔑 bcryptjs

---

## 📁 Project Structure

```bash
discord-clone/
│
├── client/
│   ├── src/
│   │   ├── pages/
│   │   ├── Style/
│   │   ├── App.jsx
│   │   └── main.jsx
│
├── server/
│   ├── models/
│   │   ├── User.js
│   │   └── Message.js
│   ├── Routes/
│   │   └── auth.js
│   ├── server.js
│   
