import { Config } from "../../config/Config";

const uploadImageFile = (imageFiles, done) => {
  let formData = new FormData();
  imageFiles.forEach((file, index) => {
    formData.append(`file${index}`, file);
  });
  fetch(`${Config.UploadServer}/upload`, {
    method: "POST",
    body: formData,
  })
    .then((res2) => res2.json())
    .then((rs) => {
      if (rs.msg === "upload successfully") {
        done({
          EC: 0,
          EM: "success",
        });
      } else {
        done({
          EC: 0,
          EM: rs.msg,
        });
      }
    });
};

export { uploadImageFile };
