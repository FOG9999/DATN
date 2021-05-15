const mongoose = require("mongoose");

var Conversation = mongoose.Schema({
  participants: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  ],
  last_message: {
    type: mongoose.Types.ObjectId,
    ref: "Message",
  },
  last_changed: Number,
  name: String,
});

module.exports = mongoose.model("Conversation", Conversation);
