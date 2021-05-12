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
  getAllProducts: async (done) => {
    try {
      let items = await Item.find({});
      let food = await Food.find({});
      await File.populate(items, {
        path: "images",
      });
      await File.populate(food, {
        path: "images",
      });
      await User.populate(items, {
        path: "seller",
      });
      await User.populate(food, {
        path: "seller",
      });
      done({
        EC: 0,
        EM: "Success",
        data: {
          items: [...items],
          food: [...food],
        },
      });
    } catch (err) {
      done({
        EC: 500,
        EM: err.toString(),
      });
    }
  },
  getAllProductIDs: async (done) => {
    try {
      let items = await Item.find({});
      let food = await Food.find({});
      done({
        EC: 0,
        EM: "Success",
        data: {
          items: [...items.map((item, ind) => item._id)],
          food: [...food.map((item, ind) => item._id)],
        },
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
  viewProduct_beta: (product_id, done) => {
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
            done({
              EC: 0,
              EM: "success",
              data: [rs1],
            });
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
                  done({
                    EC: 0,
                    EM: "success",
                    data: [rs2],
                  });
                }
              });
          }
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
    /*
    // /* cập nhật images cho các sản phẩm ---> DONE
    fetch(`${Config.SHOPEE_URL}`, {
      method: "GET",
      mode: "cors",
    })
      .then((res) => res.json())
      .then((rs) => {
        let items = rs.items.map((i, ind) => ({
          name: i.item_basic.name,
          images: [
            ...i.item_basic.images.map(
              (img, index) => `https://cf.shopee.vn/file/${img}`
            ),
          ],
          files: [],
          price: i.item_basic.price,
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
                for (let i = 0; i < items.length; i++) {
                  rs1[i + 29 + 12 + 10 + 10 + 15 + 15 + 15].title =
                    items[i].name;
                  rs1[i + 29 + 12 + 10 + 10 + 15 + 15 + 15].images = [
                    ...items[i].files,
                  ];
                  rs1[i + 29 + 12 + 10 + 10 + 15 + 15 + 15].price =
                    items[i].price / 1000;
                }
                rs1.forEach((it) => {
                  Item.findOneAndUpdate(
                    { _id: it._id },
                    {
                      title: it.title,
                      images: [...it.images],
                      price: it.price,
                    },
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
            /*
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
                      rs1[i+30].title = food[i].name;
                      rs1[i+30].images = [...food[i].files];
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
    // */

    // cập nhật seller cho các sản phẩm

    User.find({}, async (err1, rs1) => {
      if (err1) {
        console.error(err1);
        done({
          EC: 0,
          EM: err1,
        });
      } else {
        const sellers = rs1.map((rs, ind) => rs._id);
        try {
          let rdInd = Math.round(Math.random() * 7);
          let items = await Item.find({});
          let food = await Food.find({});
          for (let i = 0; i < items.length; i++) {
            rdInd = Math.round(Math.random() * 7);
            await Item.findOneAndUpdate(
              { _id: items[i]._id },
              { seller: sellers[rdInd] },
              { useFindAndModify: false }
            );
          }
          for (let i = 0; i < food.length; i++) {
            rdInd = Math.round(Math.random() * 7);
            await Food.findOneAndUpdate(
              { _id: food[i]._id },
              { seller: sellers[rdInd] },
              { useFindAndModify: false }
            );
          }
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
  updateSamplesDescription: (done) => {
    fetch(`${Config.CHOPP_URL}`, {
      method: "GET",
      mode: "cors",
    })
      .then((res) => res.json())
      .then((rs) => {
        const snacks = rs[13].products.map((pro, ind) => {
          return {
            description: pro.fields.description,
          };
        });
        Food.find({}, (err1, rs1) => {
          if (err1) {
            console.error(err1);
          } else {
            for (let i = 0; i < snacks.length; i++) {
              rs1[i + 30 + 24 + 24].description = snacks[i].description;
            }
            rs1.forEach((it) => {
              Food.findOneAndUpdate(
                { _id: it._id },
                {
                  description: it.description,
                },
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
      });
  },
  updateSamples_beta: async (done) => {
    fetch(`${Config.CHOPP_URL}`, {
      method: "GET",
      mode: "cors",
    })
      .then((res) => res.json())
      .then((rs) => {
        // rau củ trái cây
        const vegetableAndFruits = rs[1].products.map((pro, ind) => {
          return {
            name: pro.fields.name,
            images: [
              pro.fields["photo@2x"][0].url,
              pro.fields["photo@3x"][0].url,
            ],
            files: [],
            price: pro.fields.price,
            unit: pro.fields.unit,
          };
        });
        // Trái cây tươi
        const fruits = rs[2].products.map((pro, ind) => {
          return {
            name: pro.fields.name,
            images: [
              pro.fields["photo@2x"][0].url,
              pro.fields["photo@3x"][0].url,
            ],
            files: [],
            price: pro.fields.price,
            unit: pro.fields.unit,
          };
        });
        // Bánh kẹo và snack
        const snacks = rs[13].products.map((pro, ind) => {
          return {
            name: pro.fields.name,
            images: [
              pro.fields["photo@2x"][0].url,
              pro.fields["photo@3x"][0].url,
            ],
            files: [],
            price: pro.fields.price,
            unit: pro.fields.unit,
          };
        });
        FileController.create(
          snacks.map((pro, ind) => pro.images),
          (rs) => {
            for (let i = 0; i < snacks.length; i++) {
              snacks[i].files = [...rs.data[i].map((fl, ind) => fl._id)];
            }
            // update food here
            Food.find({}, (err1, rs1) => {
              if (err1) {
                console.error(err1);
              } else {
                for (let i = 0; i < snacks.length; i++) {
                  rs1[i + 30 + 24 + 24].title = snacks[i].name;
                  rs1[i + 30 + 24 + 24].images = [...snacks[i].files];
                  rs1[i + 30 + 24 + 24].price = snacks[i].price;
                  rs1[i + 30 + 24 + 24].unit = snacks[i].unit;
                }
                rs1.forEach((it) => {
                  Food.findOneAndUpdate(
                    { _id: it._id },
                    {
                      title: it.title,
                      images: [...it.images],
                      price: it.price,
                      unit: it.unit,
                    },
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
              { category: new RegExp(`${title}`, "i") },
            ],
          });
          break;
        }
        case "F": {
          result = await Food.find({
            $or: [
              { title: new RegExp(`${title}`, "i") },
              { description: new RegExp(`${title}`, "i") },
              { category: new RegExp(`${title}`, "i") },
            ],
          });
          break;
        }
        default: {
          let itemFilterRS = await Item.find({
            $or: [
              { title: new RegExp(`${title}`, "i") },
              { description: new RegExp(`${title}`, "i") },
              { category: new RegExp(`${title}`, "i") },
            ],
          });
          let foodFilterRS = await Food.find({
            $or: [
              { title: new RegExp(`${title}`, "i") },
              { description: new RegExp(`${title}`, "i") },
              { category: new RegExp(`${title}`, "i") },
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
