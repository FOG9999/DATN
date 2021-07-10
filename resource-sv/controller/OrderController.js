const Cart = require("../model/Cart");
const Driver = require("../model/Driver");
const File = require("../model/File");
const Food = require("../model/Food");
const Invoice = require("../model/Invoice");
const Item = require("../model/Item");
const Order = require("../model/Order");
const OrderProduct = require("../model/OrderProduct");
const User = require("../model/User");

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
      let selfInvoice = new Invoice({
        orders: savedOrd._id,
        ship_fees: [0],
        total: 10000,
        created_at: new Date(),
        buyer: buyer,
        payment_method: "Thanh toán khi nhận hàng",
        paypalOrder: "",
      });
      await selfInvoice.save();
      done({
        EC: 0,
        EM: "success",
        data: {
          savedOrd: { ...savedOrd },
        },
      });
    } catch (err) {
      console.log(err);
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
        .populate("buyer")
        .populate("driver");
      // console.log(allOrders);
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
      // delete from cart
      let cart = await Cart.updateOne(
        { owner: buyer },
        {
          $pull: {
            products: { $in: [...order_products.map((ordPrd) => ordPrd._id)] },
          },
        },
        { useFindAndModify: false, new: true }
      );
      console.log(cart);
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
  getCheckoutOrder: async (ord_productIDs, done) => {
    try {
      let orders = await Order.find({});
      let ord_products = await OrderProduct.find({
        _id: { $in: [...ord_productIDs] },
      }).populate("owner");
      await Item.populate(
        ord_products.filter((ordPrd) => ordPrd.pro_type === "I"),
        {
          path: "product",
        }
      );
      await Food.populate(
        ord_products.filter((ordPrd) => ordPrd.pro_type === "F"),
        {
          path: "product",
        }
      );
      await User.populate(ord_products, {
        path: "product.seller",
      });
      await File.populate(ord_products, {
        path: "product.images",
      });
      done({
        EC: 0,
        EM: "success",
        data: { products: [...ord_products] },
      });
    } catch (error) {
      done({
        EC: 500,
        EM: error.message,
      });
    }
  },
  captureOrder: async (
    paypalOrder,
    products,
    shipFeeArr,
    total,
    paymentMethod,
    buyer,
    done
  ) => {
    try {
      let captureStatus = 0;
      let orders = [];
      for (let i = 0; i < products.length; i++) {
        // kiểm tra số lượng hàng còn lại của mỗi sản phẩm trong đơn hàng
        let prd;
        if (products[i].pro_type === "I") {
          prd = await Item.findOne({ _id: products[i].product._id });
        } else {
          prd = await Food.findOne({ _id: products[i].product._id });
        }
        if (prd.quantity < products[i].order_quantity) {
          captureStatus = -1;
          break;
        } else {
          // update số lượng
          if (products[i].pro_type === "I") {
            await Item.findOneAndUpdate(
              { _id: products[i].product._id },
              { quantity: prd._doc.quantity - products[i].order_quantity },
              { useFindAndModify: false }
            );
          } else {
            await Food.findOneAndUpdate(
              { _id: products[i].product._id },
              { quantity: prd._doc.quantity - products[i].order_quantity },
              { useFindAndModify: false }
            );
          }
          // tạo order cho các order product
          let newOrder = new Order({
            createdAt: new Date(),
            buyer: buyer,
            delivery_type: "deliver",
            total: products[i].product.price * products[i].order_quantity,
            product: products[i]._id,
            delivery_date: null,
            status: "0",
            received_date: null,
            order_type: "Giao hàng tận nhà",
            pstatus: ["0"],
            last_changed: new Date(),
          });
          let savedOrd = await newOrder.save({ new: true });
          orders.push(savedOrd);
        }
      }
      if (captureStatus !== 0) {
        done({
          EC: -1,
          EM: "Không còn đủ hàng trong kho. Vui lòng kiểm tra lại đơn hàng",
        });
      } else {
        // tạo hóa đơn mới nếu tất cả hàng đều đủ
        let newInvoice = new Invoice({
          orders: [...orders.map((or, ind) => or._id)],
          ship_fees: [...shipFeeArr],
          total: total,
          created_at: new Date(),
          buyer: buyer,
          payment_method: paymentMethod,
          paypalOrder: paypalOrder,
        });
        await newInvoice.save();
        done({
          EC: 0,
          EM: "success",
        });
      }
    } catch (error) {
      done({
        EC: 500,
        EM: error.message,
      });
    }
  },
  getUserInvoices: async (user_id, done) => {
    let invoices = await Invoice.find({ buyer: user_id }).populate("orders");
    let ordersForInvoices = [];
    OrderProduct.populate(invoices, {
      path: "orders.product",
    });
    OrderProduct.populate(invoices, {
      path: "orders.driver",
    });
    if (invoices.length > 0) {
      for (let i = 0; i < invoices.length; i++) {
        let ord_products = await OrderProduct.find({
          _id: { $in: [...invoices[i].orders.map((ord, ind) => ord.product)] },
        }).populate("owner");
        await Item.populate(
          ord_products.filter((ordPrd) => ordPrd.pro_type === "I"),
          {
            path: "product",
          }
        );
        await Food.populate(
          ord_products.filter((ordPrd) => ordPrd.pro_type === "F"),
          {
            path: "product",
          }
        );
        await User.populate(ord_products, {
          path: "product.seller",
        });
        await File.populate(ord_products, {
          path: "product.images",
        });
        ordersForInvoices.push(ord_products);
      }
      done({
        EC: 0,
        EM: "success",
        data: {
          ordersForInvoices: [...ordersForInvoices],
          invoices: [...invoices],
        },
      });
    } else {
      done({
        EC: 0,
        EM: "success",
        data: {
          invoices: [],
          ordersForInvoices: [],
        },
      });
    }
  },
  startDeliverOrder: async (ordIDs, done) => {
    // can be used in case deliver multi orders
    try {
      // let ordChanged = await Order.updateMany(
      //   { _id: { $in: [...ordIDs] } },
      //   { delivery_date: new Date(), status: "1", $push: { pstatus: "1" } },
      //   { useFindAndModify: false, new: true }
      // );
      let allDrivers = await Driver.find({});
      for (let i = 0; i < ordIDs.length; i++) {
        let randomDriver =
          allDrivers[Math.floor(Math.random() * allDrivers.length)]._id;
        await Order.findOneAndUpdate(
          { _id: ordIDs[i] },
          {
            delivery_date: new Date(),
            status: "1",
            $push: { pstatus: "1" },
            driver: randomDriver,
          },
          { useFindAndModify: false }
        );
      }
      done({
        EC: 0,
        EM: "success",
        // data: ordChanged,
      });
    } catch (error) {
      console.error(error);
      done({
        EC: 500,
        EM: error.message,
      });
    }
  },
  cancelOrder: async (ordID, done) => {
    try {
      await Order.findOneAndUpdate(
        { _id: ordID },
        { status: "-1" },
        { useFindAndModify: false, new: true }
      );
      done({
        EC: 0,
        EM: "success",
      });
    } catch (err) {
      done({
        EC: 500,
        EM: err.message,
      });
    }
  },
};
