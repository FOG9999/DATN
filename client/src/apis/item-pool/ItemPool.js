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

const getPrdForRelate = (prdID, done) => {
  fetch(`${Config.ResourceServer}/product/get-for-relate/${prdID}`, {
    method: "GET",
    mode: "cors",
    credentials: "include",
  })
    .then((res) => res.json())
    .then((rs) => {
      done(rs);
    });
};

const getRelatedProduct = (type, limit, category, done) => {
  fetch(`${Config.ResourceServer}/product/relate-beta`, {
    method: "POST",
    mode: "cors",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      type: type,
      limit: limit,
      category: category,
    }),
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

const searchNoCookie = (page, pagesize, title, type, category, done) => {
  fetch(
    `${Config.ResourceServer}/product/search?type=${type}&title=${title}&category=${category}&page=${page}&pagesize=${pagesize}`,
    {
      method: "GET",
      mode: "cors",
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
  searchNoCookie,
  getPrdForRelate,
};
