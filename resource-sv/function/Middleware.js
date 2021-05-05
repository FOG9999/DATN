const { hashMsg } = require("./Functions");
const bcryptjs = require("bcryptjs");

module.exports = {
  authen: (req, res, next) => {
    try {
      let same = bcryptjs.compareSync(
        `${req.params.role}:${req.method}:${req.path}`,
        req.cookies.h_msg
      );
      // console.log(bcryptjs.hashSync("CLIENT:GET:/guest/CLIENT", 10));
      if (same) {
        next();
      } else {
        res.send({
          EC: -1,
          EM: "Hash message not compared",
        });
      }
    } catch (err) {
      res.send({
        EC: -1,
        EM: "Người dùng chưa đăng nhập",
      });
    }
  },
};
