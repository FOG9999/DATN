const mongoose = require("mongoose");

var Comment = mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "protype",
  },
  protype: {
    type: String,
    enum: ["Item", "Food"],
  },
  text: String,
  files: [
    {
      type: mongoose.Types.ObjectId,
      ref: "File",
    },
  ],
  created_at: Date,
  reply: {
    type: mongoose.Types.ObjectId,
    ref: "Reply",
    default: null,
  },
  emoji: {
    type: Number,
    default: null,
  },
});

module.exports = mongoose.model("Comment", Comment);
