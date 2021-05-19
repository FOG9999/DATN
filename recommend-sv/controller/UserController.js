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
  getUserLocation: async (user_id, done) => {
    try {
      let user = await User.findOne({ _id: user_id });
      done({
        EC: 0,
        EM: 'success',
        data: {
          user: {...user}
        }
      })
    } catch (error) {
      done({
        EC: 0,
        EM: error.message,
      });
    }
  },
};
