const mongoose = require("mongoose");

var Food = mongoose.Schema({
  title: String,
  location: Object,
  status: String,
  withDelivery: Boolean,
  category: String,
  fromDate: Date,
  price: Number,
  images: [
    {
      type: mongoose.Types.ObjectId,
      ref: "File",
    },
  ],
  descrption: String,
  createdAt: Date,
  unit: String,
  views: Number,
  seller: { type: mongoose.Types.ObjectId, refPath: "onModel" },
  onModel: {
    type: String,
    enum: ["User"],
  },
  checkDate: Date,
  quantity: Number,
  type: String,
  sold: Number,
});

module.exports = mongoose.model("Food", Food);
