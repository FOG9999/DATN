const User = require("../model/User");
const { status, secret, refresh_secret } = require("../config/Config");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = {
  register: async (
    name,
    birthday,
    username,
    phone,
    password,
    interest,
    address,
    avatar,
    role,
    done
  ) => {
    let hashed = await bcryptjs.hash(password, 10);
    User.findOne({ username: username }, (err, data) => {
      if (err) {
        done({
          EC: -1,
          EM: "Error when checking exsiting user",
        });
      }
      if (data) {
        done({
          EC: 0,
          EM: "User exsit",
        });
      } else {
        let token = jwt.sign(
          {
            username: username,
            password: password,
            date: new Date(),
          },
          secret
        );
        let new_user = new User({
          name: name,
          birthday: birthday,
          username: username,
          phone: phone,
          hashed: hashed,
          interest: interest,
          address: { ...address },
          avatar: avatar,
          token: token,
          role: role,
          status: status.A,
          pstatus: [status.A],
          last_changed: new Date(),
          created_at: new Date(),
        });
        new_user.save({ new: true }, (err2, data2) => {
          //   console.log(data2);
          done({
            EC: 0,
            EM: "User created",
            data: {
              user_id: data2._id,
              token: bcryptjs.hashSync(token, 10),
            },
          });
        });
      }
    });
  },
  login: async (password, username, done) => {
    User.findOne({ username: username }, (err1, data1) => {
      if (err1) {
        done({
          EC: -1,
          EM: "Error when authenticating in controller",
        });
      }
      if (data1) {
        bcryptjs.compare(
          password,
          data1.hashed,
          (errHash, isCorrectPassword) => {
            // console.log(errHash);
            if (isCorrectPassword) {
              // refresh token
              let token = jwt.sign(
                {
                  username: username,
                  password: password,
                  date: new Date(),
                },
                secret
              );
              User.findOneAndUpdate(
                { username: username },
                { token: token },
                { useFindAndModify: false, new: true },
                (errUpd, userUpd) => {
                  if (errUpd) {
                    done({
                      EC: -1,
                      EM: "Error when refreshing token",
                    });
                  }
                  done({
                    EC: 0,
                    EM: "User authenticated. Token refreshed",
                    data: {
                      user_id: userUpd._id,
                      token: bcryptjs.hashSync(userUpd.token, 10),
                    },
                  });
                }
              );
            } else {
              done({
                EC: 0,
                EM: "User is not defined in login",
              });
            }
          }
        );
      } else {
        done({
          EC: 0,
          EM: "User is not defined",
        });
      }
    });
  },
  authenticate: (user_id, h_token, done) => {
    User.findById({ _id: user_id }, (err1, data1) => {
      if (err1) {
        done({
          EC: -1,
          EM: "Error when finding user ID",
        });
      }
      if (data1) {
        bcryptjs.compare(data1.token, h_token, (errAuth, compared) => {
          if (errAuth) {
            done({
              EC: -1,
              EM: "Error when comparing token...",
            });
          }
          if (compared) {
            done({
              EC: 0,
              EM: "User authenticated",
            });
          } else {
            done({
              EC: 0,
              EM: "User h_token is not compared",
            });
          }
        });
      } else {
        done({
          EC: 0,
          EM: "User is not defined in authentication",
        });
      }
    });
  },
};
