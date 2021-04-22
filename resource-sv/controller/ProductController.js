const Item = require("../model/Item");
const Food = require("../model/Food");

module.exports = {
  getAllProducts: (done) => {
    try {
      Promise.all([Item.find({}), Food.find({})]).then(([items, food]) => {
        done({
          EC: 0,
          EM: "Success",
          data: {
            items: [...items.map((item, ind) => item._id)],
            food: [...food.map((item, ind) => item._id)],
          },
        });
      });
    } catch (err) {
      done({
        EC: 500,
        EM: err.toString(),
      });
    }
  },
  getProductsByIDs: (productIDs, done) => {
    Item.find({ _id: { $in: [...productIDs] } }, (err, items) => {
      if (err) {
        done({
          EC: 500,
          EM: err.toString(),
        });
      } else {
        Food.find({ _id: { $in: [...productIDs] } }, (err2, food) => {
          if (err2) {
            done({
              EC: 500,
              EM: err.toString(),
            });
          } else {
            done({
              EC: 0,
              EM: "Success",
              data: [...items, ...food],
            });
          }
        });
      }
    });
  },
};
