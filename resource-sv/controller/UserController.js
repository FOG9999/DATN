const User = require("../model/User");
const faker = require("faker");
const { ROLE } = require("../config/Config");
const { STATUS } = require("../config/Config");

module.exports = {
  createSamples: async (number, done) => {
    let output = [];
    for (let i = 0; i < number; i++) {
      let sample = new User({
        name: faker.name.findName(),
        birthday: faker.date.past(20),
        username: faker.name.findName(),
        phone: "1111111111",
        hashed: "",
        interest: "",
        address: {
          street: faker.address.streetAddress(false),
          district: faker.address.streetName(),
          city: faker.address.country,
          detail: faker.address.streetPrefix(),
        },
        avatar: faker.image.imageUrl(),
        token: "",
        role: ROLE.CLIENT,
        status: STATUS.A,
        pstatus: [STATUS.A],
        last_changed: new Date(),
        created_at: new Date(),
      });
      try {
        let saveDone = await sample.save({ new: true });
        output.push(saveDone);
      } catch (e) {
        let saveError = {
          EC: 500,
          EM: e.toString(),
        };
        done(saveError);
        break;
      }
    }
    done({
      EC: 0,
      EM: "Samples created",
      data: output,
    });
  },
  updateSamples: () => {},
  getAllUserIDs: (done) => {
    User.find({}, (err, data) => {
      if (err)
        done({
          EC: 500,
          EM: err.toString(),
        });
      done({
        EC: 0,
        EM: "Success",
        data: [...data.map((u, index) => u._id)],
      });
    });
  },
};
