const Item = require("../model/Item");
const Food = require("../model/Food");
const Config = require("../config/Config");
const response_data = require("../config/response-data-export.json");
const fetch = require("node-fetch");
const FileController = require("../controller/FileController");
const UserRating = require("../model/UserRating");
const OrderProduct = require("../model/OrderProduct");
const User = require("../model/User");
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
  getProductsByIDs: (productIDs, done) => {
    Item.find({ _id: { $in: [...productIDs] } })
      .populate("images")
      .populate("seller")
      .exec((err, items) => {
        if (err) {
          done({
            EC: 500,
            EM: err.toString(),
          });
        } else {
          Food.find({ _id: { $in: [...productIDs] } })
            .populate("images")
            .populate("seller")
            .exec((err2, food) => {
              if (err2) {
                done({
                  EC: 500,
                  EM: err2,
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
  viewProduct: (user_id, product_id, done) => {
    Item.findOneAndUpdate(
      { _id: product_id },
      { $inc: { views: 1 } },
      { useFindAndModify: false, new: true }
    )
      .populate("images")
      .exec((err1, rs1) => {
        if (err1) {
          console.error(err1);
        } else {
          if (rs1) {
            // cập nhật rating cho user và product
            UserRating.findOneAndUpdate(
              { user: user_id, product: product_id },
              {
                rating: 3 + Math.random() * 2,
                last_changed: new Date(),
              },
              { useFindAndModify: false },
              (err3, rs3) => {
                if (err3) {
                  console.error(err3);
                  done({
                    EC: 500,
                    EM: "Lỗi khi cập nhật rate",
                  });
                } else {
                  if (!rs3) {
                    let nwRate = new UserRating({
                      user: user_id,
                      product: product_id,
                      rate: Math.random() + 3,
                      last_changed: new Date(),
                    });
                    nwRate.save();
                    done({
                      EC: 0,
                      EM: "success",
                      data: [rs1],
                    });
                  } else {
                    done({
                      EC: 0,
                      EM: "success",
                      data: [rs1],
                    });
                  }
                }
              }
            );
          } else {
            Food.findOneAndUpdate(
              { _id: product_id },
              { $inc: { views: 1 } },
              { useFindAndModify: false, new: true }
            )
              .populate("images")
              .exec((err2, rs2) => {
                if (err2) {
                  console.error(err2);
                } else {
                  // cập nhật rating cho user và product
                  UserRating.findOneAndUpdate(
                    { user: user_id, product: product_id },
                    {
                      rating: 3 + Math.random() * 2,
                      last_changed: new Date(),
                    },
                    { useFindAndModify: false },
                    (err4, rs4) => {
                      if (err4) {
                        console.error(err4);
                        done({
                          EC: 500,
                          EM: "Lỗi khi cập nhật rate",
                        });
                      } else {
                        if (!rs4) {
                          let nwRate = new UserRating({
                            user: user_id,
                            product: product_id,
                            rate: Math.random() + 3,
                            last_changed: new Date(),
                          });
                          nwRate.save();
                          done({
                            EC: 0,
                            EM: "success",
                            data: [rs2],
                          });
                        } else {
                          done({
                            EC: 0,
                            EM: "success",
                            data: [rs2],
                          });
                        }
                      }
                    }
                  );
                }
              });
          }
        }
      });
  },
  updateSamples: (done) => {
    /* cập nhật images cho các sản phẩm ---> DONE
    fetch(`${Config.SHOPEE_URL}`, {
      method: "GET",
      mode: "cors",
    })
      .then((res) => res.json())
      .then((rs) => {
        let items = rs.data.sections[0].data.item.map((i, ind) => ({
          name: i.name,
          images: [
            ...i.images.map((img, index) => `https://cf.shopee.vn/file/${img}`),
          ],
          files: [],
        }));
        FileController.create(
          items.map((pro, ind) => pro.images),
          (rs) => {
            for (let i = 0; i < items.length; i++) {
              items[i].files = [...rs.data[i].map((fl, ind) => fl._id)];
            }
            // update items here
            Item.find({}, (err1, rs1) => {
              if (err1) {
                console.error(err1);
              } else {
                for (let i = 0; i < rs1.length; i++) {
                  rs1[i].title = items[i].name;
                  rs1[i].images = [...items[i].files];
                }
                rs1.forEach((it) => {
                  Item.findOneAndUpdate(
                    { _id: it._id },
                    { title: it.title, images: [...it.images] },
                    { useFindAndModify: false },
                    (error, result) => {
                      if (error) {
                        console.error(error);
                      } else {
                      }
                    }
                  );
                });
              }
            });
            const food = response_data.data.map((pro, ind) => ({
              name: pro.name,
              images: [pro.thumbnail_url],
              files: [],
            }));
            FileController.create(
              food.map((pro, ind) => pro.images),
              (rs) => {
                for (let i = 0; i < food.length; i++) {
                  food[i].files = [...rs.data[i].map((fl, ind) => fl._id)];
                }
                // update food here
                Food.find({}, (err1, rs1) => {
                  if (err1) {
                    console.error(err1);
                  } else {
                    for (let i = 0; i < rs1.length; i++) {
                      rs1[i].title = food[i].name;
                      rs1[i].images = [...food[i].files];
                    }
                    rs1.forEach((it) => {
                      Food.findOneAndUpdate(
                        { _id: it._id },
                        { title: it.title, images: [...it.images] },
                        { useFindAndModify: false },
                        (error, result) => {
                          if (error) {
                            console.error(error);
                          } else {
                          }
                        }
                      );
                    });
                    done({
                      EC: 0,
                      EM: "success",
                    });
                  }
                });
              }
            );
          }
        );
      });
      */

    // cập nhật seller cho các sản phẩm
    User.find({}, async (err1, rs1) => {
      if (err1) {
        console.error(err1);
        done({
          EC: 0,
          EM: err1,
        });
      } else {
        const sellers = rs1.slice(0, 6).map((rs, ind) => rs._id);
        try {
          await Item.updateMany(
            {},
            { seller: sellers[Math.round(Math.random() * 6)] },
            { useFindAndModify: false }
          );
          await Food.updateMany(
            {},
            { seller: sellers[Math.round(Math.random() * 6)] },
            { useFindAndModify: false }
          );
          done({
            EC: 0,
            EM: "success",
          });
        } catch (error) {
          done({
            EC: 500,
            EM: error,
          });
        }
      }
    });
  },
  search: async (page, pagesize, title, user_id, type, category, done) => {
    try {
      let result = [];
      switch (type) {
        case "I": {
          result = await Item.find({
            $or: [
              { title: new RegExp(`${title}`, "i") },
              { description: new RegExp(`${title}`, "i") },
            ],
          });
          break;
        }
        case "F": {
          result = await Food.find({
            $or: [
              { title: new RegExp(`${title}`, "i") },
              { description: new RegExp(`${title}`, "i") },
            ],
          });
          break;
        }
        default: {
          let itemFilterRS = await Item.find({
            $or: [
              { title: new RegExp(`${title}`, "i") },
              { description: new RegExp(`${title}`, "i") },
            ],
          });
          let foodFilterRS = await Food.find({
            $or: [
              { title: new RegExp(`${title}`, "i") },
              { description: new RegExp(`${title}`, "i") },
            ],
          });
          result.push(...itemFilterRS, ...foodFilterRS);
          break;
        }
      }
      if (category) {
        result = [...result.filter((pro) => pro.category === category)];
      }
      if (user_id) {
        result = [
          ...result.filter((pro) => String(pro.seller) === String(user_id)),
        ];
      }
      await File.populate(result, {
        path: "images",
      });
      done({
        EC: 0,
        EM: "success",
        data: {
          products: [...result.slice(pagesize * (page - 1), page * pagesize)],
          numOfProducts: result.length,
        },
      });
    } catch (err) {
      done({
        EC: 500,
        EM: err,
      });
    }
  },
  getUserProducts: async (user_id, page, pagesize, done) => {
    let result = [];
    let items = await Item.find({ seller: user_id });
    let food = await Food.find({ seller: user_id });
    result.push(...items, ...food);
    await File.populate(result, {
      path: "images",
    });
    done({
      EC: 0,
      EM: "success",
      data: {
        products: [...result.slice(pagesize * (page - 1), page * pagesize)],
        numOfProducts: result.length,
      },
    });
  },
};
