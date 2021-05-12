const Config = require("../config/Config");
const Booth = require("../model/Booth");
const File = require("../model/File");

module.exports = {
  create: async (
    name,
    owner,
    organization_name,
    leader_name,
    leader_phone,
    start_from,
    end_at,
    location,
    population,
    images,
    description,
    done
  ) => {
    try {
      let links = [];
      for (let i = 0; i < images.length; i++) {
        let f = new File({
          link: images[i],
        });
        let savedFile = await f.save({ new: true });
        links.push(savedFile._id);
      }
      let newBooth = new Booth({
        name: name,
        created_at: new Date(),
        owner: owner,
        organization_name: organization_name,
        leader_name: leader_name,
        leader_phone: leader_phone,
        start_from: start_from,
        end_at: end_at,
        location: { ...location },
        population: population,
        images: [...links],
        description: description,
        status: Config.boothStatus.W,
      });
      await newBooth.save();
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
  getBoothes: async (user_id, done) => {
    try {
      let list = await Booth.find({ owner: user_id });
      await File.populate(list, {
        path: "images",
      });
      done({
        EC: 0,
        EM: "success",
        data: {
          boothes: [...list],
        },
      });
    } catch (error) {
      done({
        EC: 500,
        EM: error.message,
      });
    }
  },
  getListBooth: async (page, pagesize, done) => {
    try {
      let boothes = await Booth.find({}).populate("owner").populate("images");
      let isLastPage = boothes.length <= page * pagesize;
      let length = boothes.length;
      done({
        EC: 0,
        EM: "success",
        data: {
          boothes: [...boothes.slice(pagesize * (page - 1), pagesize * page)],
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
