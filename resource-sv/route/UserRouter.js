const UserController = require("../controller/UserController");
const UserRatingController = require("../controller/UserRatingController");
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

module.exports = UserRouter;
