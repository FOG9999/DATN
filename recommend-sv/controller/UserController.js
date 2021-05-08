const User = require("../model/User");

module.exports = {
  getAllUserIDs: (done) => {
    User.find({}, (err, data) => {
      if (err)
        done({
          EC: 500,
          EM: err.toString(),
        });
      done({
        EC: 0,
        EM: "Success",
        data: [...data.map((u, index) => u._id)],
      });
    });
  },
};
