const User = require("../model/User");
const UserHistory = require("../model/UserHistory");
const UserRating = require("../model/UserRating");
const ProductController = require("./ProductController");
const UserController = require("./UserController");

module.exports = {
  createSamples: (number, done) => {
    let output = [];
    let products = [];
    let users = [];
    ProductController.getAllProductIDs((rs) => {
      products.push(...rs.data.items, ...rs.data.food);
      UserController.getAllUserIDs(async (us) => {
        users.push(...us.data);
        for (let k = 6; k < 7; k++) {
          let checkArr = [];
          for (let i = 0; i < number; i++) {
            // kiểm tra để không có trhop 1 user đánh giá 1 sản phẩm 2 lần
            let proInd = Math.round(Math.random() * (products.length - 1));
            while (checkArr.indexOf(proInd) >= 0) {
              proInd = Math.round(Math.random() * (products.length - 1));
            }
            checkArr.push(proInd);
            let sample = new UserRating({
              user: users[k], // TẠO LẦN LƯỢT RATE CHO TỪNG USER !!!!!!
              product: products[proInd],
              rating: Math.round(Math.random() * 9) + 1,
              last_changed: new Date(),
            });
            try {
              let saveDone = await sample.save();
              output.push(saveDone);
            } catch (e) {
              let saveError = {
                EC: 500,
                EM: e.toString(),
              };
              done(saveError);
              break;
            }
          }
        }
        done({
          EC: 0,
          EM: "Ratings created",
          data: output,
        });
      });
    });
  },
  updateSamples: (done) => {
    UserRating.find({}, async (err1, rs1) => {
      if (err1) {
        console.error(err1);
        done({
          EC: 500,
          EM: err1,
        });
      } else {
        for (let i = 0; i < rs1.length; i++) {
          await UserRating.findOneAndUpdate(
            { _id: rs1[i]._id },
            { rating: Math.round(Math.random() * 5) },
            { useFindAndModify: false }
          );
        }
        done({
          EC: 0,
          EM: "success",
        });
      }
    });
  },
  deleteRatingOfOneUser: (user_id, done) => {
    UserRating.deleteMany({ user: user_id }, (err, rs) => {
      if (err) {
        console.error(err);
        done({
          EC: 500,
          EM: err1,
        });
      } else {
        done({
          EC: 0,
          EM: "success",
        });
      }
    });
  },
  createUserHistory: async (done) => {
    let users = await User.find({});
    for (let i = 0; i < users.length; i++) {
      let newHistory = new UserHistory({
        user: users[i]._id,
        last_search: "",
        last_view_cate: {
          pro_type: "",
          category: "",
        },
      });
      await newHistory.save();
    }
    done({
      EC: 0,
      EM: "success",
    });
  },
};
