const BoothController = require("../controller/BoothController");
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

UserRouter.post("/create-history-samples", (req, res, next) => {
  UserRatingController.createUserHistory((rs) => {
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

UserRouter.post("/booth/:role/create", (req, res, next) => {
  const {
    name,
    organization_name,
    leader_name,
    leader_phone,
    start_from,
    end_at,
    location,
    population,
    images,
    description,
  } = req.body;
  BoothController.create(
    name,
    req.cookies.user_id,
    organization_name,
    leader_name,
    leader_phone,
    start_from,
    end_at,
    location,
    population,
    images,
    description,
    (rs) => {
      res.send(rs);
    }
  );
});

UserRouter.get("/booth/get-list/:role", authen, (req, res, next) => {
  BoothController.getBoothes(req.cookies.user_id, (rs) => {
    res.send(rs);
  });
});

module.exports = UserRouter;
