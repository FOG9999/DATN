const bcryptjs = require("bcryptjs");

module.exports = {
  hashMsg: (role, method, path) => {
    let EC = 0,
      EM = "";
    let string = `${role}:${method}:${path}`;
    console.log(string);
    try {
      EM = bcryptjs.hashSync(`${role}:${method}:${path}`, 10);
    } catch (error) {
      EC = -1;
      EM = error.toString();
    }
    return {
      EC: EC,
      EM: EM,
    };
  },
};
