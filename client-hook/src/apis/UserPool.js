import { Config } from "../config/Config";

const UserPool = {
  authen: (path, method, done) => {
    fetch(`${Config.AuthServer}/admin/authen`, {
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
  },
};

export { UserPool };
