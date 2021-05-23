const User = require("../model/User");
const faker = require("faker");
const { ROLE } = require("../config/Config");
const { STATUS } = require("../config/Config");
const Cart = require("../model/Cart");
const OrderProduct = require("../model/OrderProduct");
const ProductController = require("./ProductController");
const mongoose = require("mongoose");
const Item = require("../model/Item");
const Food = require("../model/Food");
const File = require("../model/File");
const addresses_json = JSON.parse(
  JSON.stringify(require("../config/convincesAndDistricts.json"))
);

module.exports = {
  createSamples: async (number, done) => {
    let output = [];
    for (let i = 0; i < number; i++) {
      let sample = new User({
        name: faker.name.findName(),
        birthday: faker.date.past(20),
        username: faker.name.findName(),
        phone: "1111111111",
        hashed: "",
        interest: "",
        address: {
          street: faker.address.streetAddress(false),
          district: faker.address.streetName(),
          city: faker.address.country,
          detail: faker.address.streetPrefix(),
        },
        avatar: faker.image.imageUrl(),
        token: "",
        role: ROLE.CLIENT,
        status: STATUS.A,
        pstatus: [STATUS.A],
        last_changed: new Date(),
        created_at: new Date(),
      });
      try {
        let saveDone = await sample.save({ new: true });
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
      EM: "Samples created",
      data: output,
    });
  },
  updateSamples: async (done) => {
    try {
      let users = await User.find({});
      for (let i = 0; i < users.length; i++) {
        let districtIndex = Math.round(
          (addresses_json[1].districts.length - 1) * Math.random()
        );
        let streetIndex = Math.round(
          (addresses_json[1].districts[districtIndex].streets.length - 1) *
            Math.random()
        );
        let new_location = {
          detail: faker.address.streetName(),
          street:
            addresses_json[1].districts[districtIndex].streets[streetIndex]
              .name,
          district: addresses_json[1].districts[districtIndex].name,
        };
        await User.findOneAndUpdate(
          { _id: users[i]._id },
          { address: { ...new_location } },
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
  },
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
  getCart: (user_id, done) => {
    Cart.findOne({ owner: user_id })
      .populate({
        path: "products",
      })
      .populate("owner")
      .exec(async (err1, rs1) => {
        if (err1) {
          console.error(err1);
          done({
            EC: 500,
            EM: err1,
          });
        } else {
          let output = { ...rs1._doc };
          // ProductController.getProductsByIDs(
          //   output.products.map((prd, ind) => prd.product),
          //   (rs2) => {
          //     if (rs2.EC === 0) {
          //       done({
          //         EC: 0,
          //         EM: "success",
          //         data: { ...output },
          //       });
          //     } else {
          //       done({
          //         ...rs2,
          //       });
          //     }
          //   }
          // );
          await Item.populate(
            output.products.filter((ordPrd) => ordPrd.pro_type === "I"),
            {
              path: "product",
            }
          );
          await Food.populate(
            output.products.filter((ordPrd) => ordPrd.pro_type === "F"),
            {
              path: "product",
            }
          );
          await User.populate(output, {
            path: "products.product.seller",
          });
          await File.populate(output, {
            path: "products.product.images",
          });
          done({
            EC: 0,
            EM: "success",
            data: { ...output },
          });
        }
      });
  },
  makeCartSample: async (done) => {
    let ordProducts = [];
    try {
      let ordPrd1 = new OrderProduct({
        product: "607e4b1ea19f5c20a440d2da",
        order_quantity: 1,
        delivery_location: "Not defined yet",
        pro_type: "I",
      });
      let newOrdPrd1 = await ordPrd1.save({ new: true });
      ordProducts.push(newOrdPrd1._id);
      let ordPrd2 = new OrderProduct({
        product: "607e4b15a19f5c20a440d2d0",
        order_quantity: 1,
        delivery_location: "Not defined yet",
        pro_type: "F",
      });
      let newOrdPrd2 = await ordPrd2.save({ new: true });
      ordProducts.push(newOrdPrd2._id);
      let cart = new Cart({
        products: [...ordProducts],
        owner: "60812aefcdd2af4ba4d33287",
        last_changed: new Date(),
        total: 0,
      });
      await cart.save();
      done({
        EC: 0,
        EM: "success",
      });
    } catch (e) {
      done({
        EC: 500,
        EM: e,
      });
    }
  },
  addToCart: (
    pro_id,
    pro_type,
    order_quantity,
    delivery_location,
    user_id,
    done
  ) => {
    User.findOne({ _id: user_id }, async (err1, userRS) => {
      if (err1) {
        console.error(err1);
        done({
          EC: 500,
          EM: err1,
        });
      } else {
        try {
          // cập nhật cart ngày mới nhất
          let cart = await Cart.findOneAndUpdate(
            { owner: user_id },
            { last_changed: new Date() },
            { useFindAndModify: false, new: true }
          ).populate("products");
          let indexOfPr = cart.products
            .map((ordPrd, ind) => ordPrd.product)
            .indexOf(pro_id);
          if (indexOfPr > 0) {
            // nếu trong giỏ đã có sản phẩm này thì tăng số lượng
            await OrderProduct.findOneAndUpdate(
              { _id: cart.products[indexOfPr] },
              { $inc: { order_quantity: order_quantity } },
              { useFindAndModify: false }
            );
          } else {
            // nếu chưa có trong giỏ thì tạo order product ms rồi add vào giỏ
            let newOrdPrd = new OrderProduct({
              product: pro_id,
              order_quantity: order_quantity,
              delivery_location: { ...delivery_location },
              pro_type: pro_type,
            });
            let savedOrdPrd = await newOrdPrd.save();
            cart = await Cart.findOneAndUpdate(
              { owner: user_id },
              {
                $push: { products: savedOrdPrd._id },
                last_changed: new Date(),
              },
              { useFindAndModify: false, new: true }
            );
          }
          done({
            EC: 0,
            EM: "success",
            data: { cartNum: cart.products.length },
          });
        } catch (error) {
          console.error(error);
          done({
            EC: 500,
            EM: error,
          });
        }
      }
    });
  },
  addCartsForAllUsers: async (done) => {
    const users = [
      "60750e42234bc4344011bcac",
      "6078e45f725060372071364f",
      "6078e4607250603720713650",
      "607a605bdb1a163100e49b4b",
      "607a605cdb1a163100e49b4c",
      "607e5047a19f5c20a440d3ac",
      "60818f784c61903d747326a9",
      "60812aefcdd2af4ba4d33287",
    ];
    for (let i = 0; i < users.length; i++) {
      let newCart = new Cart({
        owner: users[i],
        products: [],
        last_changed: new Date(),
        total: 0,
      });
      await newCart.save();
    }
    done({
      EC: 0,
      EM: "success",
    });
  },
  deleteFromCart: async (user_id, order_prduct_id, done) => {
    try {
      await Cart.findOneAndUpdate(
        { owner: user_id },
        { $pull: { products: order_prduct_id }, last_changed: new Date() },
        { useFindAndModify: false, new: true }
      );
      await OrderProduct.findOneAndDelete(
        { _id: order_prduct_id },
        { useFindAndModify: false }
      );
      done({
        EC: 0,
        EM: "success",
      });
    } catch (err) {
      done({
        EC: 500,
        EM: err,
      });
    }
  },
  getAvatar: async (user_id, done) => {
    let avatar = await User.findOne({ _id: user_id }, "avatar");
    done({
      EC: 0,
      EM: "success",
      data: {
        avatar: avatar,
      },
    });
  },
};
