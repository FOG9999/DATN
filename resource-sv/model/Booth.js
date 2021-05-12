const mongoose = require("mongoose");

var Booth = mongoose.Schema({
  name: String,
  created_at: Date,
  owner: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  organization_name: String,
  leader_name: String,
  leader_phone: String,
  start_from: Date,
  end_at: Date,
  location: Object,
  population: Number,
  images: [
    {
      type: mongoose.Types.ObjectId,
      ref: "File",
    },
  ],
  description: String,
  status: String,
});

module.exports = mongoose.model("Booth", Booth);
