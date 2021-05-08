const UserRating = require("../model/UserRating");

module.exports = {
  getAllRatings: (done) => {
    UserRating.find({}, (err, data) => {
      if (err) {
        done({
          EC: 500,
          EM: "Error when getting user ratings",
        });
      }
      done({
        EC: 0,
        EM: "Success",
        data: [...data.map((rating, ind) => rating._doc)],
      });
    });
  },
};
