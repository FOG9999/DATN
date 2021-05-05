const ItemController = require("../controller/ItemController");
const FoodController = require("../controller/FoodController");
const ProductRouter = require("express").Router();
const ProductController = require("../controller/ProductController");
const { authen } = require("../function/Middleware");
const { RECOMMEND_SV } = require("../config/Config");
const fetch = require("node-fetch");
const Config = require("../config/Config");
const FileController = require("../controller/FileController");
const UserRatingController = require("../controller/UserRatingController");

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

ProductRouter.get("/guest-view/:prd_id", (req, res, next) => {
  ProductController.getProductsByIDs([req.params.prd_id], (rs) => {
    res.send(rs);
  });
});

ProductRouter.get("/user-view/:prd_id/:role", authen, (req, res, next) => {
  ProductController.viewProduct(
    req.cookies.user_id,
    req.params.prd_id,
    (rs) => {
      res.send(rs);
    }
  );
});

ProductRouter.get("/relate/:product", (req, res, next) => {
  fetch(
    `${RECOMMEND_SV}/collaborative-filter/product-relate/${req.params.product}`,
    {
      method: "GET",
      mode: "cors",
    }
  )
    .then((res) => res.json())
    .then((rs) => {
      ProductController.getProductsByIDs(
        rs.suggestion.map((product, index) => product.product),
        (result) => {
          res.send({
            ...result,
          });
        }
      );
    });
});

ProductRouter.get("/search", (req, res, next) => {
  ProductController.search(
    req.query.page,
    req.query.pagesize,
    req.query.title,
    req.cookies.user_id,
    req.query.type,
    req.query.category,
    (rs) => {
      res.send(rs);
    }
  );
});

ProductRouter.get("/seller/:role/get-all", authen, (req, res, next) => {
  ProductController.getUserProducts(
    req.cookies.user_id,
    req.query.page,
    req.query.pagesize,
    (rs) => {
      res.send(rs);
    }
  );
});

// test API
ProductRouter.get("/shopee-list", (req, res, next) => {
  try {
    fetch(`${Config.SHOPEE_URL}`, {
      method: "GET",
      mode: "cors",
    })
      .then((res) => res.json())
      .then((rs) => {
        let products = rs.data.sections[0].data.item.map((i, ind) => ({
          name: i.name,
          images: [
            ...i.images.map((img, index) => `https://cf.shopee.vn/file/${img}`),
          ],
          files: [],
        }));
        FileController.create(
          products.map((pro, ind) => pro.images),
          (rs) => {
            for (let i = 0; i < products.length; i++) {
              products[i].files = [...rs.data[i]];
            }
            res.send({
              EC: 0,
              EM: "success",
              data: [...products],
            });
          }
        );
      });
  } catch (e) {
    res.send({
      EC: 500,
      EM: e.toString(),
    });
  }
});

// test API
ProductRouter.get("/sendo-list", (req, res, next) => {
  try {
    const response_data = require("../config/response-data-export.json");
    // console.log(response_data);
    const products = response_data.data.map((pro, ind) => ({
      name: pro.name,
      images: [pro.thumbnail_url],
      files: [],
    }));
    FileController.create(
      products.map((pro, ind) => pro.images),
      (rs) => {
        for (let i = 0; i < products.length; i++) {
          products[i].files = [...rs.data[i]];
        }
        res.send({
          EC: 0,
          EM: "success",
          data: [...products],
        });
      }
    );
  } catch (e) {
    res.send({
      EC: 500,
      EM: e.toString(),
    });
  }
});

ProductRouter.post("/update-samples", (req, res, next) => {
  ProductController.updateSamples((rs) => res.send(rs));
});

ProductRouter.post("/delete-user-rate", (req, res, next) => {
  UserRatingController.deleteRatingOfOneUser(req.body.user_id, (rs) =>
    res.send(rs)
  );
});

module.exports = ProductRouter;
