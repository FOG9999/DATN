const mongoose = require("mongoose");

var Item = mongoose.Schema({
  title: String,
  price: Number,
  seller: mongoose.Types.ObjectId,
  location: Object,
  description: String,
  quantity: Number,
  images: [
    {
      type: mongoose.Types.ObjectId,
    },
  ],
  category: String,
  createdAt: Date,
  views: Number,
  status: String,
  checkDate: Date,
  type: String,
  sold: Number,
});

module.exports = mongoose.model("Item", Item);
