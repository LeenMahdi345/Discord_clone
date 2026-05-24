const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  user: { type: String, required: true },
  message: { type: String, required: true },
  channel: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }, // ✅ timestamp
});

module.exports = mongoose.model("Message", MessageSchema);