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
};
