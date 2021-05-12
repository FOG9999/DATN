const AdminRouter = require("express").Router();
const { role } = require("../config/Config");
const AdminController = require("../controller/AdminController");
const BoothController = require("../controller/BoothController");
const ProductController = require("../controller/ProductController");
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

AdminRouter.post(
  "/booth/update-status/:status/:role",
  authen,
  (req, res, next) => {
    BoothController.updateStatus(req.params.status, req.body.booth_id, (rs) => {
      res.send(rs);
    });
  }
);

AdminRouter.get("/prd/get-list/:role", authen, (req, res, next) => {
  let { page, pagesize } = req.query;
  ProductController.getAllProducts((rs) => {
    let products = [...rs.data.items, ...rs.data.food];
    let isLastPage = products.length <= page * pagesize;
    let length = products.length;
    res.send({
      EC: 0,
      EM: "success",
      data: {
        products: [...products.slice(pagesize * (page - 1), page * pagesize)],
        isLastPage: isLastPage,
        length: length,
      },
    });
  });
});

module.exports = AdminRouter;
