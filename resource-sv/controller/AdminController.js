const Moderator = require("../model/Moderator");
const bcryptjs = require("bcryptjs");
const User = require("../model/User");
const jwt = require("jsonwebtoken");
const Config = require("../config/Config");

module.exports = {
  createModerator: async (
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
    try {
      let hashed = await bcryptjs.hash(password, 10);
      User.findOne({ username: username }, async (err, data) => {
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
            Config.secret
          );
          let new_user = new User({
            name: name,
            birthday: birthday,
            username: username,
            phone: phone,
            hashed: hashed,
            interest: interest,
            address: null,
            avatar: avatar,
            token: token,
            role: role,
            status: Config.status.A,
            pstatus: [Config.status.A],
            last_changed: new Date(),
            created_at: new Date(),
            online: false,
          });
          let savedUser = await new_user.save({ new: true });
          let newModerator = new Moderator({
            user: savedUser._id,
            password: password,
          });
          let savedMod = await newModerator.save({ new: true });
          done({
            EC: 0,
            EM: "success",
            data: {
              mod: { ...savedMod },
            },
          });
        }
      });
    } catch (err) {
      done({
        EC: 500,
        EM: err.message,
      });
    }
  },
  getListModerators: async (page, pagesize, done) => {
    try {
      let moderators = await Moderator.find({}).populate("user");
      let length = moderators.length;
      let isLastPage = length <= page * pagesize;
      done({
        EC: 0,
        EM: "success",
        data: {
          moderators: [
            ...moderators.slice(pagesize * (page - 1), page * pagesize),
          ],
          isLastPage: isLastPage,
          length: length,
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
