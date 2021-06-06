const { Config } = require("../../config/Config");
const faker = require("faker");

const login = (username, password, done) => {
  fetch(`${Config.AuthServer}/user/login`, {
    method: "POST",
    mode: "cors",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  })
    .then((res) => res.json())
    .then((rs) => {
      done(rs);
    });
};

const authen = (path, method, done) => {
  fetch(`${Config.AuthServer}/user/authen`, {
    method: "POST",
    mode: "cors",
    headers: {
      "content-type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      path: path,
      method: method,
    }),
  })
    .then((res) => res.json())
    .then((rs) => {
      done(rs);
    });
};

const register = (
  username,
  password,
  name,
  phone,
  address,
  interest,
  birthday,
  done
) => {
  fetch(`${Config.AuthServer}/user/register`, {
    method: "POST",
    mode: "cors",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      username: username,
      password: password,
      name: name,
      address: { ...address },
      phone: phone,
      interest: interest,
      birthday: birthday,
      avatar: faker.image.avatar(),
      role: Config.ROLE.CLIENT,
    }),
  })
    .then((res) => res.json())
    .then((rs) => {
      done(rs);
    });
};

const logout = (done) => {
  fetch(`${Config.AuthServer}/user/logout`, {
    method: "POST",
    mode: "cors",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({}),
    credentials: "include",
  })
    .then((res) => res.json())
    .then((rs) => {
      done(rs);
    });
};

const getUserAvatar = (user_id) => {
  return new Promise((resolve, reject) => {
    fetch(`${Config.ResourceServer}/user/get-avatar`, {
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

const getCart = (done) => {
  fetch(`${Config.ResourceServer}/user/cart/${Config.ROLE.CLIENT}`, {
    method: "GET",
    mode: "cors",
    credentials: "include",
  })
    .then((res) => res.json())
    .then((rs) => {
      done(rs);
    });
};

const addToCart = (pro_id, pro_type, order_quantity, location, done) => {
  fetch(`${Config.ResourceServer}/user/add-cart/${Config.ROLE.CLIENT}`, {
    method: "PUT",
    mode: "cors",
    credentials: "include",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      pro_id: pro_id,
      pro_type: pro_type,
      order_quantity: order_quantity,
      location: { ...location },
    }),
  })
    .then((res) => res.json())
    .then((rs) => {
      done(rs);
    });
};

const placeSelfDeliOrder = (
  products,
  order_quantity,
  pro_type,
  location,
  done
) => {
  fetch(
    `${Config.ResourceServer}/order/create/${Config.ROLE.CLIENT}/self-deli`,
    {
      method: "PUT",
      mode: "cors",
      headers: {
        "content-type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        location: location,
        order_quantity: order_quantity,
        pro_type: pro_type,
        products: [...products],
      }),
    }
  )
    .then((res) => res.json())
    .then((rs) => {
      done(rs);
    });
};

const removeFromCart = (order_product_id, done) => {
  fetch(`${Config.ResourceServer}/user/rmv-cart/${Config.ROLE.CLIENT}`, {
    method: "POST",
    mode: "cors",
    headers: {
      "content-type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      order_product_id: order_product_id,
    }),
  })
    .then((res) => res.json())
    .then((rs) => {
      done(rs);
    });
};

const placeDeliOrder = (order_products, done) => {
  fetch(`${Config.ResourceServer}/order/create/${Config.ROLE.CLIENT}/deli`, {
    method: "PUT",
    mode: "cors",
    headers: {
      "content-type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      order_products: [...order_products],
    }),
  })
    .then((res) => res.json())
    .then((rs) => {
      done(rs);
    });
};

const getUserOrders = (pagesize, page, done) => {
  fetch(
    `${Config.ResourceServer}/order/user-get/${Config.ROLE.CLIENT}?p=${page}&ps=${pagesize}`,
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

const getSellerProducts = (page, pagesize, done) => {
  fetch(
    `${Config.ResourceServer}/product/seller/${Config.ROLE.CLIENT}/get-all?page=${page}&pagesize=${pagesize}`,
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

const createBooth = (
  name,
  organization_name,
  leader_name,
  leader_phone,
  start_from,
  end_at,
  location,
  population,
  images,
  description,
  done
) => {
  fetch(`${Config.ResourceServer}/user/booth/${Config.ROLE.CLIENT}/create`, {
    method: "POST",
    mode: "cors",
    headers: {
      "content-type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      name: name,
      organization_name: organization_name,
      leader_name: leader_name,
      leader_phone: leader_phone,
      start_from: start_from,
      end_at: end_at,
      location: { ...location },
      images: [...images],
      description: description,
      population: population,
    }),
  })
    .then((res) => res.json())
    .then((rs) => {
      done(rs);
    });
};

const getListBoothes = (done) => {
  fetch(`${Config.ResourceServer}/user/booth/get-list/CLIENT`, {
    method: "GET",
    mode: "cors",
    credentials: "include",
  })
    .then((res) => res.json())
    .then((rs) => {
      done(rs);
    });
};

const getUserConversations = (done) => {
  fetch(`${Config.ResourceServer}/chat/user-list/${Config.ROLE.CLIENT}`, {
    method: "GET",
    mode: "cors",
    credentials: "include",
  })
    .then((res) => res.json())
    .then((rs) => {
      done(rs);
    });
};

const checkConverExist = (participants) => {
  return new Promise((resolve, reject) => {
    fetch(`${Config.ResourceServer}/chat/check-exsit`, {
      method: "POST",
      mode: "cors",
      headers: {
        "content-type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        participants: [...participants],
      }),
    })
      .then((res) => res.json())
      .then((rs) => {
        resolve(rs);
      });
  });
};

const createNewConver = (participants, name) => {
  return new Promise((resolve, reject) => {
    fetch(`${Config.ResourceServer}/chat/create-conversation`, {
      method: "POST",
      mode: "cors",
      headers: {
        "content-type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        participants: [...participants],
        name: name,
      }),
    })
      .then((res) => res.json())
      .then((rs) => {
        resolve(rs);
      });
  });
};

const getUserInfo = () => {
  return new Promise((resolve, reject) => {
    fetch(`${Config.AuthServer}/user/info`, {
      method: "GET",
      credentials: "include",
      mode: "cors",
    })
      .then((res) => res.json())
      .then((rs) => {
        resolve(rs);
      });
  });
};

const updateUserInfo = (newInfo) => {
  return new Promise((resolve, reject) => {
    fetch(`${Config.AuthServer}/user/update`, {
      method: "POST",
      mode: "cors",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        newInfo: { ...newInfo },
      }),
    })
      .then((res) => res.json())
      .then((rs) => {
        resolve(rs);
      });
  });
};

const changePassword = (from, oldPw, newPw, message) => {
  return new Promise((resolve, reject) => {
    fetch(
      `${Config.ResourceServer}/user/change-password/${Config.ROLE.CLIENT}`,
      {
        method: "POST",
        mode: "cors",
        headers: {
          "content-type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          from: from,
          msg: message,
          oldPw: oldPw,
          newPw: newPw,
        }),
      }
    )
      .then((res) => res.json())
      .then((rs) => {
        resolve(rs);
      });
  });
};

export {
  login,
  authen,
  register,
  logout,
  getCart,
  addToCart,
  placeSelfDeliOrder,
  removeFromCart,
  placeDeliOrder,
  getSellerProducts,
  getUserOrders,
  getListBoothes,
  createBooth,
  getUserConversations,
  getUserAvatar,
  checkConverExist,
  createNewConver,
  getUserInfo,
  updateUserInfo,
  changePassword,
};
