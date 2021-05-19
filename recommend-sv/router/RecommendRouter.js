const ProductController = require("../controller/ProductController");

const RecommendRouter = require("express").Router();

RecommendRouter.get("/same-locate/some", (req, res, next) => {
  const location = {
    street: req.query.str,
    district: req.query.dis,
  };
  console.log(JSON.stringify(location));
  ProductController.recommendSameLocationPros(1, 20, location, (rs) => {
    res.send(rs);
  });
});

module.exports = RecommendRouter;
