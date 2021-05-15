const OrderController = require("../controller/OrderController");
const { authen } = require("../function/Middleware");
const OrderRouter = require("express").Router();

OrderRouter.put("/create/:role/self-deli", authen, (req, res, next) => {
  OrderController.placeSelfDeliOrder(
    req.cookies.user_id,
    req.body.products,
    req.body.order_quantity,
    req.body.pro_type,
    req.body.location,
    (rs) => {
      res.send(rs);
    }
  );
});

OrderRouter.get("/user-get/:role", (req, res, next) => {
  OrderController.getUserOrder(
    req.cookies.user_id,
    req.query.p,
    req.query.ps,
    (rs) => {
      res.send(rs);
    }
  );
});

OrderRouter.put("/create/:role/deli", (req, res, next) => {
  OrderController.placeDeliOrder(
    req.body.order_products,
    req.cookies.user_id,
    (rs) => {
      res.send(rs);
    }
  );
});

OrderRouter.post("/checkout/:role", authen, (req, res, next) => {
  OrderController.getCheckoutOrder(req.body.ids, (rs) => {
    res.send(rs);
  });
});

module.exports = OrderRouter;
