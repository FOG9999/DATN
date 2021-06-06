const bcryptjs = require("bcryptjs");
const Vonage = require("@vonage/server-sdk");
const Config = require("../config/Config");

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
  sendSMS: (from, to, message) => {
    let vonage = new Vonage({
      apiKey: Config.VONAGE_API_KEY,
      apiSecret: Config.VONAGE_API_SECRET,
    });
    return new Promise((resolve, reject) => {
      vonage.message.sendSms(from, to, message, (err, result) => {
        if (err) {
          reject(err.message);
        } else {
          resolve(result);
        }
      });
    });
  },
};
