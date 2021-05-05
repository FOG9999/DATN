const mongoose = require("mongoose");

var OrderProduct = mongoose.Schema({
  product: {
    type: mongoose.Types.ObjectId,
    refPath: "onModel",
  },
  onModel: {
    type: String,
    enum: ["Item", "Food"],
  },
  order_quantity: Number,
  delivery_location: Object,
  pro_type: String,
});

module.exports = mongoose.model("OrderProduct", OrderProduct);
