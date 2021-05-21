const mongoose = require("mongoose");

var UserHistory = mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  last_search: String,
  last_view_cate: {
    category: String,
    pro_type: String,
  },
});

module.exports = mongoose.model("UserHistory", UserHistory);
