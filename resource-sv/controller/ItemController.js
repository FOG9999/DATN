const Item = require("../model/Item");
const faker = require("faker");
const { STATUS } = require("../config/Config");

const ITEM_CATEGORIES = [
  "Quần áo",
  "Đồ trang điểm",
  "Sách truyện",
  "Nhà bếp",
  "Phụ kiện trang bị",
  "Đồ dùng trong nhà",
];

module.exports = {
  createSamples: async (number, done) => {
    let output = [];
    for (let i = 0; i < number; i++) {
      let sample = new Item({
        title: faker.commerce.productName(),
        price: Math.round(Math.random() * 990000) + 10000,
        seller: null,
        brand: faker.company.companyName(),
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
          ITEM_CATEGORIES[
            Math.round(Math.random() * (ITEM_CATEGORIES.length - 1))
          ],
        createdAt: new Date(),
        views: Math.round(Math.random() * 90) + 10,
        status: STATUS.A,
        checkDate: new Date("12-04-2021"),
        type: "I",
        quantity: Math.round(Math.random() * 10),
        sold: 0,
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
