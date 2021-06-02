const User = require("../model/User");
const { status, secret, refresh_secret } = require("../config/Config");
const bcryptjs = require("bcryptjs");
const ROLE = require("../config/Config").role;
const jwt = require("jsonwebtoken");
const Cart = require("../model/Cart");
const UserHistory = require("../model/UserHistory");
const addresses_json = JSON.parse(
  JSON.stringify(require("../config/convincesAndDistricts.json"))
);

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
          EC: 500,
          EM: "Lỗi khi tìm kiếm người dùng trùng tên đăng nhập",
        });
      }
      if (data) {
        done({
          EC: 500,
          EM: "Người dùng đã tồn tại",
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
          online: false,
        });
        new_user.save({ new: true }, async (err2, data2) => {
          //   console.log(data2);
          let districtInd = addresses_json[1].districts
            .map((dis, ind) => dis.name)
            .indexOf(new_user.address.district);
          let streetInd = addresses_json[1].districts[districtInd].streets
            .map((strt, ind) => strt.name)
            .indexOf(new_user.address.street);
          // Tạo lịch sử cho người dùng mới
          let newHistory = new UserHistory({
            user: data2._id,
            last_search: "",
            last_view_cate: {
              pro_type: "",
              category: "",
            },
          });
          await newHistory.save();
          done({
            EC: 0,
            EM: "Tạo người dùng thành công",
            data:
              role === ROLE.client
                ? {
                    user_id: data2._id,
                    token: bcryptjs.hashSync(token, 10),
                    name: data2.name,
                    address: {
                      districtInd: districtInd,
                      streetInd: streetInd,
                      detail: data2.address.detail,
                    },
                  }
                : {
                    user_id: data2._id,
                    token: bcryptjs.hashSync(token, 10),
                    name: data2.name,
                  },
          });
        });
      }
    });
  },
  login: async (password, username, role, done) => {
    // dùng cho cả 2 phân hệ login
    User.findOne({ username: username, role: role }, (err1, data1) => {
      if (err1) {
        done({
          EC: 500,
          EM: err1,
        });
      } else if (data1) {
        bcryptjs.compare(
          password,
          data1.hashed,
          (errHash, isCorrectPassword) => {
            // console.log(errHash);
            if (isCorrectPassword && !data1.online) {
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
                { token: token, online: true },
                { useFindAndModify: false, new: true },
                async (errUpd, userUpd) => {
                  if (errUpd) {
                    done({
                      EC: 500,
                      EM: "Lỗi khi refresh token",
                    });
                  } else {
                    var cart = await Cart.findOne({ owner: userUpd._id });
                    let token = bcryptjs.hashSync(userUpd.token, 10);
                    let districtInd = addresses_json[1].districts
                      .map((dis, ind) => dis.name)
                      .indexOf(userUpd.address.district);
                    let streetInd = addresses_json[1].districts[
                      districtInd
                    ].streets
                      .map((strt, ind) => strt.name)
                      .indexOf(userUpd.address.street);
                    done({
                      EC: 0,
                      EM: "Đã xác minh người dùng. Token refreshed",
                      data:
                        role === ROLE.client
                          ? {
                              user_id: userUpd._id,
                              token: token,
                              name: userUpd.name,
                              cartNum: cart.products.length,
                              address: {
                                districtInd: districtInd,
                                streetInd: streetInd,
                                detail: userUpd.address.detail,
                              },
                            }
                          : {
                              user_id: userUpd._id,
                              token: token,
                              name: userUpd.name,
                            },
                    });
                  }
                }
              );
            } else if (isCorrectPassword && data1.online) {
              done({
                EC: -1,
                EM: "Người dùng đang đăng nhập. Không thể đăng nhập tiếp",
              });
            } else {
              done({
                EC: -1,
                EM: "Người dùng không xác định trong login",
              });
            }
          }
        );
      } else {
        done({
          EC: -1,
          EM: "Không thể xác minh người dùng. Đăng nhập lại!",
        });
      }
    });
  },
  authenticate: (user_id, h_token, done) => {
    User.findOne({ _id: user_id }, (err1, data1) => {
      if (err1) {
        done({
          EC: 500,
          EM: "Error when finding user ID",
        });
      } else if (data1) {
        bcryptjs.compare(data1.token, h_token, (errAuth, compared) => {
          if (errAuth) {
            done({
              EC: 500,
              EM: "Error when comparing token...",
            });
          } else if (compared) {
            done({
              EC: 0,
              EM: "Xác minh người dùng thành công",
            });
          } else {
            done({
              EC: -1,
              EM: "User h_token is not compared",
            });
          }
        });
      } else {
        done({
          EC: -1,
          EM: "Người dùng không xác định in authentication",
        });
      }
    });
  },
  logout: (user_id, done) => {
    User.findOneAndUpdate(
      { _id: user_id },
      { online: false },
      { new: true, useFindAndModify: false },
      (err, data) => {
        if (err) {
          done({
            EC: 500,
            EM: err.toString(),
          });
        } else {
          if (!data) {
            done({
              EC: -1,
              EM: "Không tìm thấy user",
            });
          } else {
            done({
              EC: 0,
              EM: "Success",
            });
          }
        }
      }
    );
  },
  getUserInfo: async (user_id, done) => {
    try {
      let user = await User.findOne({ _id: user_id });
      done({
        EC: 0,
        EM: "success",
        data: {
          user: user,
        },
      });
    } catch (error) {
      done({
        EC: 500,
        EM: error.message,
      });
    }
  },
};
