const Food = require("../model/Food");
const FOOD_CATEGORIES = ["Rau xanh", "Hoa quả", "Trứng", "Thủy sản"];
const { STATUS } = require("../config/Config");
const faker = require("faker");

module.exports = {
  createSamples: async (number, done) => {
    let output = [];
    for (let i = 0; i < number; i++) {
      let sample = new Food({
        title: faker.commerce.productName(),
        price: Math.round(Math.random() * 990000) + 10000,
        location: {
          street: faker.address.streetAddress(false),
          district: faker.address.streetName(),
          city: faker.address.country,
          detail: faker.address.streetPrefix(),
        },
        description: faker.lorem.paragraphs(
          Math.round(Math.random() * 2) + 1,
          "line"
        ),
        images: [],
        category:
          FOOD_CATEGORIES[
            Math.round(Math.random() * (FOOD_CATEGORIES.length - 1))
          ],
        createdAt: new Date(),
        views: Math.round(Math.random() * 90) + 10,
        status: STATUS.A,
        checkDate: new Date("12-04-2021"),
        type: "F",
        sold: 0,
        withDelivery: Math.random() > 0.5 ? true : false,
        unit: "KG",
        seller: null,
        quantity: Math.round(Math.random() * 10),
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
  updateSamples: (done) => {},
};
