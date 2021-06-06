const mongoose = require("mongoose");

var OTP = mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  code: String,
  from: Number,
});

module.exports = mongoose.model("OTP", OTP);
