const mongoose = require("mongoose");

var File = mongoose.Schema({
  link: String,
});

module.exports = mongoose.model("File", File);
