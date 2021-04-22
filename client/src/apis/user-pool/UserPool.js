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

export { login, authen, register, logout };
