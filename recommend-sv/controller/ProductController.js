const Item = require("../model/Item");
const Food = require("../model/Food");
const File = require("../model/File");

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
  getMostPopular: async (limit, done) => {
    let num = parseInt(limit);
    // try {
    let items = await Item.find({});
    let food = await Food.find({});
    let output = [];
    output.push(...items, ...food);
    await File.populate(output, {
      path: "images",
    });
    output.sort((a, b) => b.views - a.views);
    done({
      EC: 0,
      EM: "success",
      data: {
        products: [...output.slice(0, num)],
      },
    });
    // } catch (error) {
    //   done({
    //     EC: 500,
    //     EM: error,
    //   });
    // }
  },
  getRelatedProducts: async (type, category, limit, done) => {
    let num = parseInt(limit);
    switch (type) {
      case "I": {
        let itemsSameCate = await Item.find({ category: category }).populate(
          "images"
        );
        itemsSameCate.sort((a, b) => b.views - a.views);
        done({
          EC: 0,
          EM: "success",
          data: {
            suggestion: [...itemsSameCate.slice(0, num)],
          },
        });
        break;
      }
      case "F": {
        let foodSameCate = await Food.find({ category: category }).populate(
          "images"
        );
        foodSameCate.sort((a, b) => b.views - a.views);
        done({
          EC: 0,
          EM: "success",
          data: {
            suggestion: [...foodSameCate.slice(0, num)],
          },
        });
        break;
      }
      default: {
        done({ EC: -1, EM: "type error" });
        break;
      }
    }
  },
};
