const AdminRouter = require("express").Router();
const { role } = require("../config/Config");
const AdminController = require("../controller/AdminController");
const BoothController = require("../controller/BoothController");
const { authen } = require("../function/Middleware");

AdminRouter.post("/create-account/mod/:role", authen, (req, res, next) => {
  const {
    name,
    birthday,
    username,
    phone,
    password,
    interest,
    address,
    avatar,
    role,
  } = req.body;
  AdminController.createModerator(
    name,
    birthday,
    username,
    phone,
    password,
    interest,
    address,
    avatar,
    role,
    (rs) => {
      res.send(rs);
    }
  );
});

AdminRouter.get("/get-accounts/mod/:role", authen, (req, res, next) => {
  AdminController.getListModerators(
    req.query.page,
    req.query.pagesize,
    (rs) => {
      res.send(rs);
    }
  );
});

AdminRouter.get("/get-boothes/:role", authen, (req, res, next) => {
  BoothController.getListBooth(req.query.page, req.query.pagesize, (rs) => {
    res.send(rs);
  });
});

module.exports = AdminRouter;
