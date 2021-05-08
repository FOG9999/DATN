const UserController = require("../controller/UserController");
const UserRatingController = require("../controller/UserRatingController");
const { authen } = require("../function/Middleware");
const UserRouter = require("express").Router();

UserRouter.post("/create-samples", (req, res, next) => {
  const number = req.body.number;
  UserController.createSamples(number, (rs) => {
    res.send(rs);
  });
});

UserRouter.post("/create-samples/ratings", (req, res, next) => {
  const number = req.body.number;
  UserRatingController.createSamples(number, (rs) => {
    res.send(rs);
  });
});

UserRouter.post("/cart/make-sample", (req, res, next) => {
  UserController.makeCartSample((rs) => {
    res.send(rs);
  });
});

UserRouter.get("/cart/:role", authen, (req, res, next) => {
  UserController.getCart(req.cookies.user_id, (rs) => {
    res.send(rs);
  });
});

UserRouter.put("/add-cart/:role", authen, (req, res, next) => {
  UserController.addToCart(
    req.body.pro_id,
    req.body.pro_type,
    req.body.order_quantity,
    req.body.location,
    req.cookies.user_id,
    (rs) => {
      res.send(rs);
    }
  );
});

UserRouter.put("/add-cart-samples", (req, res, next) => {
  UserController.addCartsForAllUsers((rs) => res.send(rs));
});

UserRouter.post("/rmv-cart/:role", authen, (req, res, next) => {
  UserController.deleteFromCart(
    req.cookies.user_id,
    req.body.order_product_id,
    (rs) => {
      res.send(rs);
    }
  );
});

UserRouter.post("/update-samples", (req, res, next) => {
  UserController.updateSamples((rs) => {
    res.send(rs);
  });
});

module.exports = UserRouter;
