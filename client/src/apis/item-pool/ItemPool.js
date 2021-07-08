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

const rcmCheapPros = () => {
  return new Promise((resolve, reject) => {
    fetch(`${Config.UploadServer}/recommend/cheap-pros`, {
      method: "GET",
      mode: "cors",
    })
      .then((res) => res.json())
      .then((rs) => {
        resolve(rs);
      });
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

const search = (page, pagesize, title, type, category) => {
  let url = `${Config.ResourceServer}/product/search?type=${type}&title=${title}&category=${category}&page=${page}&pagesize=${pagesize}`;
  return new Promise((resolve, reject) => {
    fetch(url, {
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
  district,
  min,
  max
) => {
  let url = `${Config.ResourceServer}/product/search?id=${
    user_id ? user_id : ""
  }&type=${type}&title=${title}&category=${category}&page=${page}&pagesize=${pagesize}`;
  if (district) url += `&district=${district}`;
  if (min) url += `&min=${min}`;
  if (max) url += `&max=${max}`;
  return new Promise((resolve, reject) => {
    fetch(url, {
      method: "GET",
      mode: "cors",
    })
      .then((res) => res.json())
      .then((rs) => {
        resolve(rs);
      });
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

const getCommentsOnPrd = (prd_id) => {
  return new Promise((resolve, reject) => {
    fetch(
      `${Config.ResourceServer}/product/cmt/${Config.ROLE.CLIENT}/on-prd?id=${prd_id}`,
      {
        method: "GET",
        mode: "cors",
        headers: {
          "content-type": "application/json",
        },
        credentials: "include",
      }
    )
      .then((res) => res.json())
      .then((rs) => {
        resolve(rs);
      });
  });
};

const postComment = (comment) => {
  return new Promise((resolve, reject) => {
    fetch(`${Config.ResourceServer}/product/cmt/${Config.ROLE.CLIENT}/post`, {
      method: "POST",
      mode: "cors",
      headers: {
        "content-type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        comment: comment,
      }),
    })
      .then((res) => res.json())
      .then((rs) => {
        resolve(rs);
      });
  });
};

const replyComment = (comment_id, reply) => {
  console.log(comment_id, reply);
  return new Promise((resolve, reject) => {
    fetch(`${Config.ResourceServer}/product/cmt/${Config.ROLE.CLIENT}/reply`, {
      method: "POST",
      mode: "cors",
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        comment_id,
        reply,
      }),
    })
      .then((res) => res.json())
      .then((rs) => {
        resolve(rs);
      });
  });
};

// const getPrdSeller = (prd_id) => {
//   return new Promise((resolve, reject) => {
//     fetch(`${Config.ResourceServer}/product/seller?prd_id=${prd_id}`)
//     .then(res => res.json())
//     .then(rs => {
//       resolve(rs)
//     })
//     .catch(err => {
//       reject(err)
//     })
//   })
// }

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
  rcmCheapPros,
  getCommentsOnPrd,
  postComment,
  replyComment,
  // getPrdSeller
};
