const Driver = require("../model/Driver");
const faker = require("faker");

module.exports = {
  createSamples: async (number, done) => {
    try {
      for (let i = 0; i < number; i++) {
        let newDriver = new Driver({
          name: faker.name.findName(),
          phone: faker.phone.phoneNumber(),
          plate_number: faker.lorem.word(9),
          created_at: new Date(),
          status: 0, //ACTIVE,
          five_star: Math.round(Math.random() * 50),
          four_star: Math.round(Math.random() * 50),
          three_star: Math.round(Math.random() * 50),
          two_star: Math.round(Math.random() * 50),
          one_star: Math.round(Math.random() * 50),
          avatar: faker.image.avatar(),
        });
        await newDriver.save();
      }
      done({
        EC: 0,
        EM: "success",
      });
    } catch (err) {
      done({
        EC: 500,
        EM: err.message,
      });
    }
  },
};
