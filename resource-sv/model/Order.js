const mongoose = require("mongoose");

var Order = mongoose.Schema({
  createdAt: Date,
  buyer: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  delivery_type: String,
  total: Number,
  product: {
    type: mongoose.Types.ObjectId,
    ref: "OrderProduct",
  },
  //   location: String,
  delivery_date: Date,
  status: String,
  received_date: Date,
  order_type: String,
  pstatus: [
    {
      type: Number,
    },
  ],
  last_changed: Date,
  driver: {
    type: mongoose.Types.ObjectId,
    ref: "Driver",
    default: null,
  },
});

module.exports = mongoose.model("Order", Order);
