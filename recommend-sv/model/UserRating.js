const mongoose = require("mongoose");

var UserRating = mongoose.Schema({
  user: { type: mongoose.Types.ObjectId, ref: "User" },
  product: { type: mongoose.Types.ObjectId, refPath: "onModel" },
  onModel: {
    type: String,
    enum: ["Item", "Food"],
  },
  rating: Number,
  last_changed: Date,
});

module.exports = mongoose.model("UserRating", UserRating);
