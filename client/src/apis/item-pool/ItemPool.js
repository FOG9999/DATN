import { Config } from "../../config/Config";

const rcmGuestItems = (done) => {
  fetch(`${Config.ResourceServer}/product/guest/${Config.ROLE.CLIENT}`, {
    method: "GET",
    mode: "cors",
  })
    .then((res) => res.json())
    .then((rs) => done(rs));
};

const rcmUserItems = (done) => {
  fetch(`${Config.ResourceServer}/product/user/${Config.ROLE.CLIENT}`, {
    method: "GET",
    mode: "cors",
    credentials: "include",
  })
    .then((res) => res.json())
    .then((rs) => {
      done(rs);
    });
};

export { rcmGuestItems, rcmUserItems };
