const File = require("../model/File");
const Food = require("../model/Food");
const Item = require("../model/Item");
const Order = require("../model/Order");
const OrderProduct = require("../model/OrderProduct");

module.exports = {
  placeSelfDeliOrder: async (
    buyer,
    products,
    order_quantity,
    pro_type,
    location,
    done
  ) => {
    try {
      let ordPrd = new OrderProduct({
        product: products[0],
        order_quantity: order_quantity,
        delivery_location: location,
        pro_type: pro_type,
      });
      let savedOrdPrd = await ordPrd.save({ new: true });
      let selfOrd = new Order({
        createdAt: new Date(),
        buyer: buyer,
        delivery_type: "self",
        total: 0,
        product: savedOrdPrd._id,
        delivery_date: null,
        status: "0",
        received_date: null,
        order_type: "Tự lấy hàng",
        pstatus: [0],
        last_changed: new Date(),
      });
      let savedOrd = await selfOrd.save({ new: true });
      done({
        EC: 0,
        EM: "success",
        data: {
          savedOrd: { ...savedOrd },
        },
      });
    } catch (err) {
      done({
        EC: 500,
        EM: err,
      });
    }
  },
  getUserOrder: async (user_id, page, pagesize, done) => {
    try {
      let allOrders = await Order.find({})
        .populate("product")
        .populate("buyer");
      await Item.populate(
        allOrders.filter((ord) => ord.product.pro_type === "I"),
        {
          path: "product.product",
        }
      );
      await Food.populate(
        allOrders.filter((ord) => ord.product.pro_type === "F"),
        {
          path: "product.product",
        }
      );
      await File.populate(allOrders, {
        path: "product.product.images",
      });
      let output = allOrders.filter(
        (ord) => String(ord.product.product.seller) === user_id
      );
      done({
        EC: 0,
        EM: "success",
        data: {
          orders: [...output],
          numOfOrds: output.length,
        },
      });
    } catch (err) {
      done({
        EC: 500,
        EM: err.toString(),
      });
    }
  },
  placeDeliOrder: async (order_products, buyer, done) => {
    let orders = [];
    try {
      for (let i = 0; i < order_products.length; i++) {
        let newOrd = new Order({
          createdAt: new Date(),
          buyer: buyer,
          delivery_type: "deliver",
          total:
            order_products[i].product.price * order_products[i].order_quantity,
          product: order_products[i]._id,
          delivery_date: null,
          status: "0",
          received_date: null,
          order_type: "Giao hàng tận nhà",
          pstatus: ["0"],
          last_changed: new Date(),
        });
        let savedOrd = await newOrd.save({ new: true });
        orders.push(savedOrd);
      }
      done({
        EC: 0,
        EM: "success",
        data: {
          orders: [...orders],
        },
      });
    } catch (err) {
      done({
        EC: 500,
        EM: err,
      });
    }
  },
};
