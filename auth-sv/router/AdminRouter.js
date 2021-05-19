const AdminRouter = require("express").Router();
const { role } = require("../config/Config");
const UserController = require("../controller/UserController");
const { hashMsg } = require("../function/Functions");

AdminRouter.post("/login", (req, res, next) => {
  UserController.login(
    req.body.password,
    req.body.username,
    role.system.admin,
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
      }
      res.send({
        EC: data.EC,
        EM: data.EM,
        data: { ...dataToSend },
      });
    }
  );
});

AdminRouter.post("/authen", (req, res, next) => {
  const { user_id, h_token } = req.cookies;
  const { method, path } = req.body;
  UserController.authenticate(user_id, h_token, (data) => {
    res.send({
      ...data,
      h_msg: data.EC === 0 ? hashMsg(role.system.admin, method, path).EM : "",
    });
  });
});

module.exports = AdminRouter;