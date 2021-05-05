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

const getPrdByID = (itemID, done) => {
  fetch(`${Config.ResourceServer}/product/guest-view/${itemID}`, {
    method: "GET",
    mode: "cors",
  })
    .then((res) => res.json())
    .then((rs) => {
      done(rs);
    });
};

const getPrdByIDForUser = (itemID, done) => {
  fetch(
    `${Config.ResourceServer}/product/user-view/${itemID}/${Config.ROLE.CLIENT}`,
    {
      method: "GET",
      mode: "cors",
      credentials: "include",
    }
  )
    .then((res) => res.json())
    .then((rs) => {
      done(rs);
    });
};

const getRelatedProduct = (productID, done) => {
  fetch(`${Config.ResourceServer}/product/relate/${productID}`, {
    method: "GET",
    mode: "cors",
  })
    .then((res) => res.json())
    .then((rs) => done(rs));
};

const search = (page, pagesize, title, type, category, done) => {
  fetch(
    `${Config.ResourceServer}/product/search?type=${type}&title=${title}&category=${category}&page=${page}&pagesize=${pagesize}`,
    {
      method: "GET",
      mode: "cors",
      credentials: "include",
    }
  )
    .then((res) => res.json())
    .then((rs) => {
      done(rs);
    });
};

export {
  rcmGuestItems,
  rcmUserItems,
  getPrdByID,
  getRelatedProduct,
  getPrdByIDForUser,
  search,
};
