const SampleRouter = require("express").Router();
const DriverController = require("../controller/DriverController");

SampleRouter.put("/driver/:number", (req, res, next) => {
  DriverController.createSamples(req.params.number, (rs) => {
    res.send(rs);
  });
});

module.exports = SampleRouter;
