const mongoose = require("mongoose");

var Reply = mongoose.Schema({
  seller: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  text: String,
  files: [
    {
      type: mongoose.Types.ObjectId,
      ref: "File",
    },
  ],
  created_at: Date,
});

module.exports = mongoose.model("Reply", Reply);
