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
  turnStringsToRegex: (strings) => {
    let output = ".*" + strings[0];
    if (strings.length > 1) {
      for (let i = 1; i < strings.length; i++) {
        output += `.*${strings[i]}`;
      }
    }
    return new RegExp(output + ".*", "i");
  },
};
