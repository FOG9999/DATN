const mongoose = require("mongoose");

var Cart = mongoose.Schema({
  products: [
    {
      type: mongoose.Types.ObjectId,
      ref: "OrderProduct",
    },
  ],
  owner: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  last_changed: Date,
  total: Number,
});

module.exports = mongoose.model("Cart", Cart);
