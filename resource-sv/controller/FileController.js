const File = require("../model/File");

module.exports = {
  create: async (links, done) => {
    let files = [];
    for (let i = 0; i < links.length; i++) {
      files.push([]);
      for (let j = 0; j < links[i].length; j++) {
        let new_img = new File({
          link: links[i][j],
        });
        let new_file = await new_img.save({ new: true });
        files[i].push(new_file);
      }
    }

    done({
      EC: 0,
      EM: "success",
      data: [...files],
    });
  },
};
