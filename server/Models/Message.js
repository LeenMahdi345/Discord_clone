const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },

  message: {
    type: String,
    required: true,
  },

  channel: {
    type: String,
    required: true,
  },

  time: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Message", messageSchema);