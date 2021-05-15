const mongoose = require("mongoose");

var Seen = mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  seen: Boolean,
  conversation: {
    type: mongoose.Types.ObjectId,
    ref: "Conversation",
  },
});

module.exports = mongoose.model("Seen", Seen);
