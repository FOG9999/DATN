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

const getConversation = (conID, page, pagesize, done) => {
  fetch(
    `${Config.ResourceServer}/chat/conversation/${Config.ROLE.CLIENT}?page=${page}&pagesize=${pagesize}&id=${conID}`,
    {
      method: "GET",
      mode: "cors",
      credentials: "include",
    }
  )
    .then((res) => res.json())
    .then((rs) => {
      done(rs);
    });
};

export { uploadImageFile, getConversation };
