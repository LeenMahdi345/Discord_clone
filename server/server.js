const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
require("dotenv").config();

const jwt = require("jsonwebtoken");
const { Server } = require("socket.io");

const authRoutes = require("./Routes/auth");
const Message = require("./Models/Message"); 

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Server Running");
});

app.get("/api/messages/:channel", async (req, res) => {
  try {
    const messages = await Message.find({ channel: req.params.channel })
      .sort({ createdAt: 1 }); 
    res.json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error("No token provided"));
  }
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = user; 
    next();
  } catch (err) {
    next(new Error("Invalid token"));
  }
});

io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  socket.on("join_channel", (channel) => {
    socket.join(channel);
  });

  socket.on("send_message", async (data) => {
    if (!socket.user?.username) return;

    const newMessage = new Message({
      user: socket.user.username, 
      message: data.message,
      channel: data.channel,
    });

    await newMessage.save();

    io.to(data.channel).emit("receive_message", {
      _id: newMessage._id, 
      user: newMessage.user,
      message: newMessage.message,
      channel: newMessage.channel,
      createdAt: newMessage.createdAt,
    });
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected");
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});