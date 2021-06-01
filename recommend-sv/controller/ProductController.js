const Item = require("../model/Item");
const Food = require("../model/Food");
const File = require("../model/File");
const UserHistory = require("../model/UserHistory");
const { turnStringsToRegex } = require("../function/Function");

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
  getMostPopular: async (page, pagesize, done) => {
    // try {
    let items = await Item.find({ status: "Active" });
    let food = await Food.find({ status: "Active" });
    let products = [];
    products.push(...items, ...food);
    let isLastPage = products.length <= page * pagesize;
    let output = products.slice(pagesize * (page - 1), page * pagesize);
    await File.populate(output, {
      path: "images",
    });
    output.sort((a, b) => b.views - a.views);
    done({
      EC: 0,
      EM: "success",
      data: {
        products: [...output],
        isLastPage: isLastPage,
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
        let itemsSameCate = await Item.find({
          category: category,
          status: "Active",
        }).populate("images");
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
        let foodSameCate = await Food.find({
          category: category,
          status: "Active",
        }).populate("images");
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
  recommendSameLocationPros: async (page, pagesize, location, done) => {
    try {
      let items = await Item.find({
        "location.district": location.district,
        status: "Active",
      });
      let food = await Food.find({
        "location.district": location.district,
        status: "Active",
      });
      let products = [...items, ...food];
      let isLastPgae = page * pagesize >= products.length;
      let output = products.slice((page - 1) * pagesize, pagesize * page);
      await File.populate(output, {
        path: "images",
      });
      done({
        EC: 0,
        EM: "success",
        data: {
          products: [...output],
          isLastPgae: isLastPgae,
        },
      });
    } catch (error) {
      done();
    }
  },
  rcmBaseonHistory: async (page, pagesize, user_id, done) => {
    try {
      let history = await UserHistory.findOne({ user: user_id });
      let { last_search, last_view_cate } = history._doc;
      if (last_search || last_view_cate.category) {
        // tìm kiếm các sản phẩm với tư khóa cuối cùng mà user tìm kiếm -> lấy 5
        let forSearch = [];
        let strings = last_search.split(" ");
        let regexes = turnStringsToRegex(strings);
        console.log(regexes);
        if (last_search) {
          let itemFilterRS = await Item.find({
            $or: [
              { title: regexes },
              { description: regexes },
              { category: regexes },
            ],
            status: "Active",
          });
          let foodFilterRS = await Food.find({
            $or: [
              { title: regexes },
              { description: regexes },
              { category: regexes },
            ],
            status: "Active",
          });
          forSearch.push(...itemFilterRS, ...foodFilterRS);
        }
        // tìm kiếm theo category giống sản phẩm cuối cùng mà user xem
        let forLastCate = [];
        if (last_view_cate.pro_type === "I") {
          let cateitems = await Item.find({
            category: last_view_cate.category,
            status: "Active",
          });
          forLastCate.push(...cateitems);
        } else {
          let catefood = await Food.find({
            category: last_view_cate.category,
            status: "Active",
          });
          forLastCate.push(...catefood);
        }
        let products = [...forSearch, ...forLastCate];
        products.sort((a, b) => b.views - a.views);
        let isLastPage = page * pagesize >= products.length;
        await File.populate(products, {
          path: "images",
        });
        let uniqueoutputID = [];
        let uniqueoutput = [];
        products.forEach((ele) => {
          if (uniqueoutputID.indexOf(String(ele.title)) < 0) {
            uniqueoutput.push(ele);
            uniqueoutputID.push(String(ele.title));
          }
        });
        let output = uniqueoutput.slice((page - 1) * pagesize, pagesize * page);
        done({
          EC: 0,
          EM: "success",
          data: {
            products: [...output],
            isLastPage: isLastPage,
          },
        });
      } else {
        done({
          EC: -1,
          EM: "no history found",
        });
      }
    } catch (error) {
      done({
        EC: 500,
        EM: error.message,
      });
    }
  },
  recommendCheapProducts: async (done) => {
    let items = await Item.find({ status: "Active" })
      .populate("images")
      .sort({ price: 1 })
      .limit(5);
    let food = await Food.find({})
      .populate("images")
      .sort({ price: 1 })
      .limit(5);
    let cheaps = [...items, ...food];
    done({
      EC: 0,
      EM: "success",
      data: {
        products: [...cheaps],
      },
    });
  },
};
