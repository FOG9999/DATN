const UserRouter = require("express").Router();
const { role } = require("../config/Config");
const UserController = require("../controller/UserController");
const { hashMsg } = require("../function/Functions");

UserRouter.post("/login", (req, res, next) => {
  UserController.login(
    req.body.password,
    req.body.username,
    role.client,
    (data) => {
      let dataToSend = {};
      if (data.EC === 0) {
        /* set cookie failed :(((
        res.cookie("user_id", data.data.user_id, {
          expires: new Date(Date.now() + 900000),
          httpOnly: true,
        });
        res.cookie("h_token", data.data.token, {
          expires: new Date(Date.now() + 900000),
          httpOnly: true,
        });
        */
        dataToSend.user_id = data.data.user_id;
        dataToSend.h_token = data.data.token;
        dataToSend.name = data.data.name;
        dataToSend.cartNum = data.data.cartNum;
        dataToSend.address = data.data.address;
      }
      res.send({
        EC: data.EC,
        EM: data.EM,
        data: { ...dataToSend },
      });
    }
  );
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
      let dataToSend = {};
      if (data.EC === 0) {
        dataToSend.user_id = data.data.user_id;
        dataToSend.h_token = data.data.token;
        dataToSend.name = data.data.name;
        dataToSend.address = data.data.address;
      }
      /* set cookie failed 
      res.cookie("user_id", data.data.user_id, {
        expires: new Date(Date.now() + 900000),
        httpOnly: true,
      });
      res.cookie("h_token", data.data.token, {
        expires: new Date(Date.now() + 900000),
        httpOnly: true,
      });
      */
      res.send({
        EC: data.EC,
        EM: data.EM,
        data: { ...dataToSend },
      });
    }
  );
});

UserRouter.post("/authen", (req, res, next) => {
  const { user_id, h_token } = req.cookies;
  const { method, path } = req.body;
  UserController.authenticate(user_id, h_token, (data) => {
    res.send({
      ...data,
      h_msg: data.EC === 0 ? hashMsg(role.client, method, path).EM : "",
    });
  });
});

UserRouter.post("/logout", (req, res, next) => {
  UserController.logout(req.cookies.user_id, (rs) => {
    res.send(rs);
  });
});

UserRouter.get("/info", (req, res, next) => {
  UserController.getUserInfo(req.cookies.user_id, (rs) => {
    res.send(rs);
  });
});

UserRouter.post("/update", (req, res, next) => {
  UserController.updateUser(req.body.newInfo, (rs) => {
    res.send(rs);
  });
});

module.exports = UserRouter;
