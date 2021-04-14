const mongoose = require("mongoose");

var Food = mongoose.Schema({
  title: String,
  from: Object,
  status: String,
  withDelivery: Boolean,
  category: String,
  fromDate: Date,
  images: [
    {
      type: mongoose.Types.ObjectId,
    },
  ],
  descrption: String,
  createdAt: Date,
  unit: String,
  views: Number,
  booth: mongoose.Types.ObjectId,
  outOfStock: Boolean,
  checkDate: Date,
  quantity: Number,
  type: String,
  sold: Number,
});

module.exports = mongoose.model("Food", Food);
