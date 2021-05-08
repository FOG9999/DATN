const mongoose = require("mongoose");

var Item = mongoose.Schema({
  title: String,
  price: Number,
  seller: { type: mongoose.Types.ObjectId, refPath: "onModel" },
  onModel: {
    type: String,
    enum: ["User"],
  },
  location: Object,
  description: String,
  quantity: Number,
  images: [
    {
      type: mongoose.Types.ObjectId,
      ref: "File",
    },
  ],
  category: String,
  createdAt: Date,
  views: Number,
  status: String,
  checkDate: Date,
  type: String,
  brand: String,
  sold: Number,
});

module.exports = mongoose.model("Item", Item);
