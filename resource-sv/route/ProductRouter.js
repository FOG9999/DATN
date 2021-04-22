const ItemController = require("../controller/ItemController");
const FoodController = require("../controller/FoodController");
const ProductRouter = require("express").Router();
const ProductController = require("../controller/ProductController");
const { authen } = require("../function/Middleware");
const { RECOMMEND_SV } = require("../config/Config");
const fetch = require("node-fetch");

ProductRouter.post("/create-samples/:type", (req, res, next) => {
  const type = req.params.type;
  const number = req.body.number;
  switch (type) {
    case "item": {
      ItemController.createSamples(number, (rs) => {
        res.send(rs);
      });
      break;
    }
    case "food": {
      FoodController.createSamples(number, (rs) => {
        res.send(rs);
      });
      break;
    }
    default:
      break;
  }
});

ProductRouter.get("/guest/:role", (req, res, next) => {
  fetch(`${RECOMMEND_SV}/collaborative-filter/new-user`, {
    method: "GET",
    mode: "cors",
  })
    .then((res) => res.json())
    .then((rs) => {
      rs.averages.sort((a, b) => b.average - a.average);
      ProductController.getProductsByIDs(
        rs.averages.map((aver, ind) => aver.itemID),
        (rs) => {
          res.send(rs);
        }
      );
    });
});

ProductRouter.get("/user/:role", authen, (req, res, next) => {
  fetch(
    `${RECOMMEND_SV}/collaborative-filter/recommend/${req.cookies.user_id}`,
    {
      method: "GET",
      mode: "cors",
    }
  )
    .then((res) => res.json())
    .then((rs) => {
      ProductController.getProductsByIDs(
        rs.topNItems.map((top, index) => top.item),
        (result) => res.send(result)
      );
    });
});

ProductRouter.get("/all", (req, res, next) => {
  ProductController.getAllProducts((rs) => {
    res.send(rs);
  });
});

module.exports = ProductRouter;
