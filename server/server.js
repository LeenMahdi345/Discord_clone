const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
require("dotenv").config();

const jwt = require("jsonwebtoken");
const { Server } = require("socket.io");

const authRoutes = require("./Routes/auth");
const Message = require("./models/Message");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

// DB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Server Running");
});

// old messages per channel
app.get("/api/messages/:channel", async (req, res) => {
  try {
    const messages = await Message.find({
      channel: req.params.channel,
    });

    res.json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});


// 🔐 JWT middleware socket
io.use((socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token) return next(); // allow anonymous OR you can block

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = user;
    next();
  } catch (err) {
    next(new Error("Invalid token"));
  }
});


// 🔥 SOCKET
io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  // JOIN ROOM (channel)
  socket.on("join_channel", (channel) => {
    socket.join(channel);
  });

  // SEND MESSAGE
  socket.on("send_message", async (data) => {

    const newMessage = new Message({
      user: data.user,
      message: data.message,
      channel: data.channel,
    });

    await newMessage.save();

    // 🔥 IMPORTANT: send only to room
    io.to(data.channel).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected");
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});