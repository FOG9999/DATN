const UserRouter = require("express").Router();
const { role } = require("../config/Config");
const UserController = require("../controller/UserController");
const { hashMsg } = require("../function/Functions");

UserRouter.post("/login", (req, res, next) => {
  UserController.login(req.body.password, req.body.username, (data) => {
    if (data.EM === "User authenticated") {
      req.cookies.user_id = data.data.user_id;
      req.cookies.h_token = data.data.token;
    }
    res.send({
      EC: data.EC,
      EM: data.EM,
      h_msg: hashMsg(role.client, req.method, req.path),
    });
  });
});

UserRouter.post("/register", (req, res, next) => {
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
  UserController.register(
    name,
    birthday,
    username,
    phone,
    password,
    interest,
    address,
    avatar,
    role,
    (data) => {
      req.cookies.user_id = data.data.user_id;
      req.cookies.h_token = data.data.token;
      res.send({
        EC: data.EC,
        EM: data.EM,
        h_msg: hashMsg(role.client, req.method, req.path),
      });
    }
  );
});

UserRouter.post("/authen", (req, res, next) => {
  const { user_id, h_token } = req.cookies;
  UserController.authenticate(user_id, h_token, (data) => {
    res.send({
      ...data,
      h_msg: hashMsg(role.client, req.method, req.path),
    });
  });
});

module.exports = UserRouter;
