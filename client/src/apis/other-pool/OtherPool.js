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

const createLivestream = (streamID, name, title) => {
  return new Promise((resolve, reject) => {
    fetch(`${Config.ResourceServer}/livestream`, {
      method: "POST",
      mode: "cors",
      headers: {
        "content-type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        title: title,
        id: streamID,
        name: name,
      }),
    })
      .then((res) => res.json())
      .then((rs) => {
        resolve(rs);
      });
  });
};

const getStream = (id) => {
  return new Promise((resolve, reject) => {
    fetch(`${Config.ResourceServer}/stream-init?id=${id}`, {
      method: "GET",
      mode: "cors",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((rs) => {
        resolve(rs);
      });
  });
};

const joinStream = (id) => {
  return new Promise((resolve, reject) => {
    fetch(`${Config.ResourceServer}/watch-stream?id=${id}`, {
      method: "GET",
      mode: "cors",
    })
      .then((res) => res.json())
      .then((rs) => {
        resolve(rs);
      });
  });
};

const searchInConverList = (keyword, page, pagesize) => {
  return new Promise((resolve, reject) => {
    fetch(`${Config.ResourceServer}/chat/search?keyword=${keyword}`, {
      method: "GET",
      mode: "cors",
      headers: {
        "content-type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((rs) => {
        resolve(rs);
      });
  });
};

export {
  uploadImageFile,
  getConversation,
  createLivestream,
  getStream,
  joinStream,
  searchInConverList,
};
