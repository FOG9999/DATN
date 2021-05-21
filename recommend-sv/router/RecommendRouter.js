const ProductController = require("../controller/ProductController");

const RecommendRouter = require("express").Router();

RecommendRouter.get("/same-locate/some", (req, res, next) => {
  const location = {
    street: req.query.str,
    district: req.query.dis,
  };
  //   console.log(JSON.stringify(location));
  ProductController.recommendSameLocationPros(1, 20, location, (rs) => {
    res.send(rs);
  });
});

RecommendRouter.get("/user-prefer", (req, res, next) => {
  ProductController.rcmBaseonHistory(
    req.query.page,
    req.query.pagesize,
    req.cookies.user_id,
    (rs) => {
      if (rs.EC !== 0) {
        console.log(rs.EM);
        ProductController.getMostPopular(
          req.query.page,
          req.query.pagesize,
          (altRs) => {
            res.send(altRs);
          }
        );
      } else {
        res.send(rs);
      }
    }
  );
});

module.exports = RecommendRouter;
