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

export { getCheckoutOrder };
