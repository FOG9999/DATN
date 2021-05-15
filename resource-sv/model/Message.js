const mongoose = require("mongoose");

var Message = mongoose.Schema({
  text: String,
  file: {
    type: mongoose.Types.ObjectId,
    ref: "File",
  },
  sender: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  conversation: {
    type: mongoose.Types.ObjectId,
    ref: "Conversation",
  },
  created_at: Number,
});

module.exports = mongoose.model("Message", Message);
