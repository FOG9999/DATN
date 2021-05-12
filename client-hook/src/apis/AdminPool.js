import { Config } from "../config/Config";

const AdminPool = {
  login: (username, password, done) => {
    fetch(`${Config.AuthServer}/admin/login`, {
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
  },
  getModerators: (page, pagesize, done) => {
    fetch(
      `${Config.ResourceServer}/admin/get-accounts/mod/${Config.ROLE.SYSTEM.admin}?page=${page}&pagesize=${pagesize}`,
      {
        methos: "GET",
        mode: "cors",
        credentials: "include",
      }
    )
      .then((res) => res.json())
      .then((rs) => {
        done(rs);
      });
  },
  createModerator: (name, phone, username, password, done) => {
    fetch(
      `${Config.ResourceServer}/admin/create-account/mod/${Config.ROLE.SYSTEM.admin}`,
      {
        method: "POST",
        mode: "cors",
        headers: {
          "content-type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: name,
          phone: phone,
          username: username,
          password: password,
          birthday: null,
          interest: "",
          address: {},
          avatar: "",
          role: Config.ROLE.SYSTEM.admin,
        }),
      }
    )
      .then((res) => res.json())
      .then((rs) => {
        done(rs);
      });
  },
  getListBoothes: (page, pagesize, done) => {
    fetch(
      `${Config.ResourceServer}/admin/get-boothes/${Config.ROLE.SYSTEM.admin}?page=${page}&pagesize=${pagesize}`,
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
  },
  updateBoothStatus: (status, booth_id, done) => {
    fetch(
      `${Config.ResourceServer}/admin/booth/update-status/${status}/${Config.ROLE.SYSTEM.admin}`,
      {
        method: "POST",
        mode: "cors",
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          booth_id: booth_id,
        }),
      }
    )
      .then((res) => res.json())
      .then((rs) => {
        done(rs);
      });
  },
  getAllProducts: (page, pagesize, done) => {
    fetch(
      `${Config.ResourceServer}/admin/prd/get-list/${Config.ROLE.SYSTEM.admin}?page=${page}&pagesize=${pagesize}`,
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
  },
};

export { AdminPool };
