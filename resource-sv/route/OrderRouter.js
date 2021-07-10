const OrderController = require("../controller/OrderController");
const { authen } = require("../function/Middleware");
const OrderRouter = require("express").Router();
const paypalsdk = require("@paypal/checkout-server-sdk");
const Config = require("../config/Config");

const RADIO = 23000;

OrderRouter.put("/create/:role/self-deli", authen, (req, res, next) => {
  OrderController.placeSelfDeliOrder(
    req.cookies.user_id,
    req.body.products,
    req.body.order_quantity,
    req.body.pro_type,
    req.body.location,
    (rs) => {
      res.send(rs);
    }
  );
});

OrderRouter.get("/user-get/:role", (req, res, next) => {
  OrderController.getUserOrder(
    req.cookies.user_id,
    req.query.p,
    req.query.ps,
    (rs) => {
      res.send(rs);
    }
  );
});

OrderRouter.put("/create/:role/deli", (req, res, next) => {
  OrderController.placeDeliOrder(
    req.body.order_products,
    req.cookies.user_id,
    (rs) => {
      res.send(rs);
    }
  );
});

OrderRouter.post("/checkout/:role", authen, (req, res, next) => {
  OrderController.getCheckoutOrder(req.body.ids, (rs) => {
    res.send(rs);
  });
});

OrderRouter.post("/make-payment/:role", authen, async (req, res, next) => {
  const request = new paypalsdk.orders.OrdersCreateRequest();
  const env = new paypalsdk.core.SandboxEnvironment(
    Config.PAYPAL_CLIENT,
    Config.PAYPAL_SECRET
  );
  const client = new paypalsdk.core.PayPalHttpClient(env);
  var order;
  let valueStr = (req.body.value / RADIO).toString();
  let value = parseFloat(valueStr.substring(0, valueStr.indexOf(".") + 2));

  request.prefer("return=representation");
  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: value, // tax = 2.9% + 0.3
        },
      },
    ],
    application_context: {
      return_url: req.body.return_url,
    },
  });

  try {
    order = await client.execute(request);
  } catch (err) {
    console.error(err);
    return res.send(500);
  }
  console.log("Order của " + req.cookies.user_id, JSON.stringify(order));
  res.send({
    EC: 0,
    EM: "success",
    data: {
      approve: order.result.links[1].href,
      orderID: order.result.id,
      products: [...req.body.products],
      total: req.body.value,
      shipFeeArr: [...req.body.shipFeeArr],
      paymentMethod: req.body.paymentMethod,
    },
  });
});

OrderRouter.post("/capture", (req, res, next) => {
  const { orderID, products, total, shipFeeArr, paymentMethod } = req.body;
  OrderController.captureOrder(
    orderID,
    products,
    shipFeeArr,
    total,
    paymentMethod,
    req.cookies.user_id,
    (rs) => {
      if (rs.EC === 0) {
        captureOrder(orderID, (ppRes) => {
          console.log("paypal response: " + ppRes);
        });
      }
      res.send(rs);
    }
  );
});

OrderRouter.get("/my-invoices/:role", authen, (req, res, next) => {
  OrderController.getUserInvoices(req.cookies.user_id, (rs) => {
    res.send(rs);
  });
});

OrderRouter.put("/deliver-ord/:role", authen, (req, res, next) => {
  OrderController.startDeliverOrder(req.body.ordIDs, (rs) => {
    res.send(rs);
  });
});

OrderRouter.delete("/cancel/:role/:ordID", (req, res, next) => {
  OrderController.cancelOrder(req.params.ordID, (rs) => {
    res.send(rs);
  });
});

let captureOrder = async function (orderId, cb) {
  let request = new paypalsdk.orders.OrdersCaptureRequest(orderId);
  request.requestBody({});
  const env = new paypalsdk.core.SandboxEnvironment(
    Config.PAYPAL_CLIENT,
    Config.PAYPAL_SECRET
  );
  const client = new paypalsdk.core.PayPalHttpClient(env);
  // Call API with your client and get a response for your call
  let response = await client.execute(request);
  console.log(`Response: ${JSON.stringify(response)}`);
  // If call returns body in response, you can get the deserialized version from the result attribute of the response.
  console.log(`Capture: ${JSON.stringify(response.result)}`);
  cb(response);
};

module.exports = OrderRouter;
