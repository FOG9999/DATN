const mongoose = require("mongoose");

let Invoice = mongoose.Schema({
  driver: {
    type: String,
    default: null,
  },
  orders: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Order",
    },
  ],
  ship_fees: [
    {
      type: Number,
    },
  ],
  total: Number,
  created_at: Date,
  payment_method: String,
  buyer: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  paypalOrder: String,
});

module.exports = mongoose.model("Invoice", Invoice);
