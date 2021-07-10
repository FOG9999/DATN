import { Config } from "../../config/Config";

const getCheckoutOrder = (ord_productIDs, done) => {
  fetch(`${Config.ResourceServer}/order/checkout/${Config.ROLE.CLIENT}`, {
    method: "POST",
    mode: "cors",
    headers: {
      "content-type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      ids: [...ord_productIDs],
    }),
  })
    .then((res) => res.json())
    .then((rs) => {
      done(rs);
    });
};

const captureOrder = (orderID, products, total, shipFeeArr, paymentMethod) => {
  return new Promise((resolve, reject) => {
    fetch(`${Config.ResourceServer}/order/capture`, {
      method: "POST",
      mode: "cors",
      headers: {
        "content-type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        orderID: orderID,
        products: [...products],
        total: total,
        shipFeeArr: [...shipFeeArr],
        paymentMethod: paymentMethod,
      }),
    })
      .then((res) => res.json())
      .then((rs) => {
        resolve(rs);
      });
  });
};

const makePayment = (total, paymentMethod, products, shipFeeArr) => {
  return new Promise((resolve, reject) => {
    fetch(`${Config.ResourceServer}/order/make-payment/${Config.ROLE.CLIENT}`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      mode: "cors",
      credentials: "include",
      body: JSON.stringify({
        value: total,
        shipFeeArr: [...shipFeeArr],
        products: [...products],
        paymentMethod: paymentMethod,
        return_url: "http://localhost:3000/processing",
      }),
    })
      .then((res) => res.json())
      .then((rs) => {
        resolve(rs);
      });
  });
};

const getInvoices = () => {
  return new Promise((resolve, reject) => {
    fetch(`${Config.ResourceServer}/order/my-invoices/${Config.ROLE.CLIENT}`, {
      method: "GET",
      mode: "cors",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((rs) => {
        resolve(rs);
      });
  });
};

const startDeliver = (ordIDs) => {
  return new Promise((resolve, reject) => {
    fetch(`${Config.ResourceServer}/order/deliver-ord/${Config.ROLE.CLIENT}`, {
      method: "PUT",
      mode: "cors",
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        ordIDs: [...ordIDs],
      }),
    })
      .then((res) => res.json())
      .then((rs) => {
        resolve(rs);
      });
  });
};

const cancelOrder = (ordID) => {
  return new Promise((resolve, reject) => {
    fetch(
      `${Config.ResourceServer}/order/cancel/${Config.ROLE.CLIENT}/${ordID}`,
      {
        method: "DELETE",
        mode: "cors",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({}),
      }
    )
      .then((res) => res.json())
      .then((rs) => {
        resolve(rs);
      });
  });
};

export {
  getCheckoutOrder,
  makePayment,
  getInvoices,
  captureOrder,
  startDeliver,
  cancelOrder,
};
