const Food = require("../model/Food");
const FOOD_CATEGORIES = ["Rau xanh", "Hoa quả", "Trứng", "Thủy sản"];
const { STATUS } = require("../config/Config");
const faker = require("faker");
const User = require("../model/User");
const addresses_json = JSON.parse(
  JSON.stringify(require("../config/convincesAndDistricts.json"))
);

module.exports = {
  createSamples: async (number, done) => {
    let output = [];
    let sellers = (await User.find({})).map((sel, ind) => sel._id);
    for (let i = 0; i < number; i++) {
      let districtIndex = Math.round(
        (addresses_json[1].districts.length - 1) * Math.random()
      );
      let streetIndex = Math.round(
        (addresses_json[1].districts[districtIndex].streets.length - 1) *
          Math.random()
      );
      let new_location = {
        detail: faker.address.streetName(),
        street:
          addresses_json[1].districts[districtIndex].streets[streetIndex].name,
        district: addresses_json[1].districts[districtIndex].name,
      };
      let sellerInd = Math.round(Math.random() * (sellers.length - 1));
      let sample = new Food({
        title: faker.commerce.productName(),
        price: Math.round(Math.random() * 990000) + 10000,
        location: {
          ...new_location,
        },
        description: faker.lorem.paragraphs(
          Math.round(Math.random() * 2) + 1,
          "line"
        ),
        images: [],
        category: "Bánh kẹo và snack",
        createdAt: new Date(),
        views: Math.round(Math.random() * 10) + 10,
        status: STATUS.A,
        checkDate: new Date("02-05-2021"),
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
  updateSamples: async (done) => {
    try {
      let food = (await Food.find({})).map((fo, index) => fo._id);
      /*
      for (let i = 0; i < 30; i++) {
        let districtIndex = Math.round(
          (addresses_json[1].districts.length - 1) * Math.random()
        );
        let streetIndex = Math.round(
          (addresses_json[1].districts[districtIndex].streets.length - 1) *
            Math.random()
        );
        let new_location = {
          detail: faker.address.streetName(),
          street:
            addresses_json[1].districts[districtIndex].streets[streetIndex]
              .name,
          district: addresses_json[1].districts[districtIndex].name,
        };
        await Food.findOneAndUpdate(
          {
            _id: food[i],
          },
          {
            location: {
              ...new_location,
            },
          },
          {
            useFindAndModify: false,
          }
        );
      }
      */
      await Food.updateMany(
        {},
        { category: "Sản phẩm thịt" },
        { useFindAndModify: false }
      );
      done({
        EC: 0,
        EM: "success",
      });
    } catch (err) {
      done({
        EC: 500,
        EM: err,
      });
    }
  },
};
