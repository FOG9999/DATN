const Item = require("../model/Item");
const faker = require("faker");
const { STATUS } = require("../config/Config");
const User = require("../model/User");
const File = require("../model/File");
const addresses_json = JSON.parse(
  JSON.stringify(require("../config/convincesAndDistricts.json"))
);

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
      let sample = new Item({
        title: faker.commerce.productName(),
        price: Math.round(Math.random() * 990000) + 10000,
        seller: sellers[sellerInd],
        brand: faker.company.companyName(),
        location: {
          ...new_location,
        },
        description: faker.lorem.paragraphs(
          Math.round(Math.random() * 2) + 1,
          "line"
        ),
        images: [],
        category: "Trang trí",
        createdAt: new Date(),
        views: Math.round(Math.random() * 10) + 10,
        status: STATUS.A,
        checkDate: new Date("02-05-2021"),
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
  updateSamples: async (done) => {
    try {
      let food = (await Item.find({})).map((fo, index) => fo._id);
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
        await Item.findOneAndUpdate(
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
  createItem: async (
    title,
    price,
    seller,
    location,
    description,
    quantity,
    images,
    category,
    brand,
    done
  ) => {
    try {
      let imageFiles = [];
      for (let i = 0; i < images.length; i++) {
        let file = new File({
          link: images[i],
        });
        let savedFile = await file.save({ new: true });
        imageFiles.push(savedFile._id);
      }
      let newItem = new Item({
        title: title,
        price: price,
        seller: seller,
        location: { ...location },
        description: description,
        quantity: quantity,
        images: [...imageFiles],
        category: category,
        brand: brand,
        createdAt: new Date(),
        views: 0,
        status: STATUS.W,
        checkDate: null,
        type: "I",
        sold: 0,
      });
      let saved = await newItem.save({ new: true });
      done({
        EC: 0,
        EM: "success",
        data: {
          product: { ...saved },
        },
      });
    } catch (err) {
      done({
        EC: 500,
        EM: err.message,
      });
    }
  },
};
