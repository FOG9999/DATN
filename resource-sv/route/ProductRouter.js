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
  // fetch(`${RECOMMEND_SV}/collaborative-filter/new-user`, {
  //   method: "GET",
  //   mode: "cors",
  // })
  //   .then((res) => res.json())
  //   .then((rs) => {
  //     rs.averages.sort((a, b) => b.average - a.average);
  //     ProductController.getProductsByIDs(
  //       rs.averages.map((aver, ind) => aver.itemID),
  //       (rs) => {
  //         res.send(rs);
  //       }
  //     );
  //   });
  fetch(
    `${RECOMMEND_SV}/most-popular?page=${req.query.page}&pagesize=${req.query.pagesize}`,
    {
      method: "GET",
      mode: "cors",
    }
  )
    .then((res) => res.json())
    .then((rs) => {
      res.send(rs);
    });
});

ProductRouter.get("/user/:role", authen, (req, res, next) => {
  // fetch(
  //   `${RECOMMEND_SV}/collaborative-filter/recommend/${req.cookies.user_id}`,
  //   {
  //     method: "GET",
  //     mode: "cors",
  //   }
  // )
  //   .then((res) => res.json())
  //   .then((rs) => {
  //     ProductController.getProductsByIDs(
  //       rs.topNItems.map((top, index) => top.item),
  //       (result) => res.send(result)
  //     );
  //   });
  fetch(`${RECOMMEND_SV}/most-popular?limit=18`, {
    method: "GET",
    mode: "cors",
  })
    .then((res) => res.json())
    .then((rs) => {
      res.send(rs);
    });
});

ProductRouter.get("/all", (req, res, next) => {
  ProductController.getAllProducts((rs) => {
    res.send(rs);
  });
});

ProductRouter.get("/guest-view/:prd_id", (req, res, next) => {
  ProductController.viewProduct_beta(null, req.params.prd_id, (rs) => {
    res.send(rs);
  });
});

ProductRouter.get("/user-view/:prd_id/:role", authen, (req, res, next) => {
  // ProductController.viewProduct(
  //   req.cookies.user_id,
  //   req.params.prd_id,
  //   (rs) => {
  //     res.send(rs);
  //   }
  // );
  ProductController.viewProduct_beta(
    req.cookies.user_id,
    req.params.prd_id,
    (rs) => {
      res.send(rs);
    }
  );
});

ProductRouter.get("/get-for-relate/:prd_id", (req, res, next) => {
  // ProductController.viewProduct(
  //   req.cookies.user_id,
  //   req.params.prd_id,
  //   (rs) => {
  //     res.send(rs);
  //   }
  // );
  ProductController.getProductsByIDs([req.params.prd_id], (rs) => {
    res.send(rs);
  });
});

ProductRouter.get("/relate/:product", (req, res, next) => {
  fetch(`${RECOMMEND_SV}/user/product-relate/${req.params.product}`, {
    method: "GET",
    mode: "cors",
  })
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

ProductRouter.post("/relate-beta", (req, res, next) => {
  // console.log(req.query.category);
  fetch(`${RECOMMEND_SV}/product/relate`, {
    method: "POST",
    mode: "cors",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      type: req.body.type,
      limit: req.body.limit,
      category: req.body.category,
    }),
  })
    .then((res) => res.json())
    .then((rs) => {
      // ProductController.getProductsByIDs(
      //   rs.data.suggestion.map((product, index) => product.product),
      //   (result) => {
      //     res.send({
      //       ...result,
      //     });
      //   }
      // );
      res.send(rs);
    });
});

ProductRouter.get("/search", (req, res, next) => {
  ProductController.search(
    req.query.page,
    req.query.pagesize,
    req.query.title,
    req.query.id, // người tìm kiếm
    req.cookies.user_id, // người bán
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
  ProductController.updateSamplesPrice((rs) => res.send(rs));
});

ProductRouter.post("/delete-user-rate", (req, res, next) => {
  UserRatingController.deleteRatingOfOneUser(req.body.user_id, (rs) =>
    res.send(rs)
  );
});

ProductRouter.post("/update-samples-location", (req, res, next) => {
  ItemController.updateSamples((rs) => {
    if (rs.EC !== 0) {
      res.send(rs);
    } else {
      FoodController.updateSamples((foodRS) => {
        res.send(foodRS);
      });
    }
  });
});

ProductRouter.post("/create/:role/:type", authen, (req, res, next) => {
  switch (req.params.type) {
    case "I": {
      const {
        title,
        price,
        location,
        description,
        quantity,
        images,
        category,
        brand,
      } = req.body.product;
      ItemController.createItem(
        title,
        price,
        req.cookies.user_id,
        location,
        description,
        quantity,
        images,
        category,
        brand,
        (rs) => {
          res.send(rs);
        }
      );
      break;
    }
    case "F": {
      const {
        title,
        price,
        location,
        description,
        quantity,
        images,
        category,
        unit,
      } = req.body.product;
      FoodController.createFood(
        title,
        price,
        req.cookies.user_id,
        location,
        description,
        quantity,
        images,
        category,
        unit,
        (rs) => {
          res.send(rs);
        }
      );
      break;
    }
    default: {
      res.send({
        EC: -1,
        EM: "Không thể thực hiện request",
      });
    }
  }
});

module.exports = ProductRouter;
