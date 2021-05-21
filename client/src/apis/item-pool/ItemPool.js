import { Config } from "../../config/Config";

const rcmGuestItems = (page, pagesize, done) => {
  fetch(
    `${Config.ResourceServer}/product/guest/${Config.ROLE.CLIENT}?page=${page}&pagesize=${pagesize}`,
    {
      method: "GET",
      mode: "cors",
    }
  )
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

const createProduct = (product, type, done) => {
  fetch(`${Config.ResourceServer}/product/create/CLIENT/${type}`, {
    method: "POST",
    mode: "cors",
    headers: {
      "content-type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      product: { ...product },
    }),
  })
    .then((res) => res.json())
    .then((rs) => {
      done(rs);
    });
};

const searchNoCookie = (
  page,
  pagesize,
  title,
  type,
  category,
  user_id,
  done
) => {
  fetch(
    `${Config.ResourceServer}/product/search?id=${
      user_id ? user_id : ""
    }&type=${type}&title=${title}&category=${category}&page=${page}&pagesize=${pagesize}`,
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

const rcmSameLocationPros = (street, district) => {
  return new Promise((resolve, reject) => {
    fetch(
      `${Config.UploadServer}/recommend/same-locate/some?str=${street}&dis=${district}`,
      {
        method: "GET",
        mode: "cors",
      }
    )
      .then((res) => res.json())
      .then((rs) => {
        resolve(rs);
      });
  });
};

const rcmUserBaseOnHistory = (page, pagesize) => {
  return new Promise((resolve, reject) => {
    fetch(
      `${Config.UploadServer}/recommend/user-prefer?page=${page}&pagesize=${pagesize}`,
      {
        method: "GET",
        mode: "cors",
        credentials: "include",
      }
    )
      .then((res) => res.json())
      .then((rs) => {
        resolve(rs);
      });
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
  createProduct,
  rcmSameLocationPros,
  rcmUserBaseOnHistory,
};
