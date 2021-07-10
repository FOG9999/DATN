const mongoose = require("mongoose");

var Driver = mongoose.Schema({
  name: String,
  phone: String,
  plate_number: String,
  created_at: Date,
  status: Number, // used for future like accept new register
  ship_count: {
    type: Number,
    default: 0,
  },
  five_star: Number,
  four_star: Number,
  three_star: Number,
  two_star: Number,
  one_star: Number,
  avatar: String,
});

module.exports = mongoose.model("Driver", Driver);
