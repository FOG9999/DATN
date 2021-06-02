const mongoose = require("mongoose");

var User = mongoose.Schema({
  name: String,
  birthday: Date,
  username: String,
  phone: String,
  hashed: String,
  token: String,
  refresh_token: String,
  interest: String,
  address: Object,
  email: String,
  avatar: String,
  role: String,
  status: String,
  pstatus: Array,
  last_changed: Date,
  created_at: Date,
  online: Boolean,
});

module.exports = mongoose.model("User", User);
