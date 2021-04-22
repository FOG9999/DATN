const UserRating = require("../model/UserRating");
const ProductController = require("./ProductController");
const UserController = require("./UserController");

module.exports = {
  createSamples: (number, done) => {
    let output = [];
    let products = [];
    let users = [];
    ProductController.getAllProducts((rs) => {
      products.push(...rs.data.items, ...rs.data.food);
      UserController.getAllUserIDs(async (us) => {
        users.push(...us.data);
        for (let i = 0; i < number; i++) {
          let sample = new UserRating({
            user: users[Math.round(Math.random() * (users.length - 1))],
            product:
              products[Math.round(Math.random() * (products.length - 1))],
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
        done({
          EC: 0,
          EM: "Ratings created",
          data: output,
        });
      });
    });
  },
};
