const Comment = require("../model/Comment");
const Reply = require("../model/Reply");
const User = require("../model/User");
const faker = require("faker");
const File = require("../model/File");
const Food = require("../model/Food");
const Item = require("../model/Item");

let CommentController = {
  createSamples: async (done) => {
    const pro_id = "607e4b1ea19f5c20a440d2db";
    const user_id = "607e5047a19f5c20a440d3ac";
    const seller_id = "60818f784c61903d747326a9";
    try {
      let file = new File({
        link: faker.image.avatar(),
      });
      let reply = new Reply({
        seller: seller_id,
        text: faker.lorem.words(20),
        files: [],
        created_at: new Date(),
      });
      let savedReply = await reply.save();
      let savedFile = await file.save({ new: true });
      let comment = new Comment({
        user: user_id,
        product: pro_id,
        text: faker.lorem.words(20),
        files: [savedFile._id],
        created_at: new Date("2021-06-01T03:24:00"),
        reply: null,
      });
      await comment.save({ new: true });
      done({
        EC: 0,
        EM: "success",
      });
    } catch (error) {
      done({
        EC: 500,
        EM: error.message,
      });
    }
  },
  getCommentsOnPrd: async (prd_id, user_id, done) => {
    // user_id để kiểm tra xem có phải là seller không
    try {
      let comments = await Comment.find({ product: prd_id })
        .populate("reply")
        .populate("user")
        .populate("files");
      await File.populate(comments, {
        path: "reply.files",
      });
      await User.populate(comments, {
        path: "reply.seller",
      });
      let isSeller = false;
      if (comments.length) {
        let prd = await Item.findOne({ _id: comments[0].product });
        if (!prd) {
          prd = await Food.findOne({ _id: comments[0].product });
        }
        if (String(prd.seller) === String(user_id)) {
          isSeller = true;
        }
      }
      done({
        EC: 0,
        EM: "success",
        data: {
          comments: [...comments],
          isSeller: isSeller,
        },
      });
    } catch (error) {
      done({
        EC: 500,
        EM: error.message,
      });
    }
  },
  postComment: async (comment, done) => {
    try {
      let files = [];
      for (let i = 0; i < comment.files.length; i++) {
        let file = new File({
          link: comment.files[i],
        });
        let savedFile = await file.save({ new: true });
        files.push(savedFile);
      }
      let new_comment = new Comment({
        user: comment.user,
        product: comment.product,
        text: comment.text,
        files: [...files],
        created_at: new Date(),
      });
      await new_comment.save();
      done({
        EC: 0,
        EM: "success",
      });
    } catch (error) {
      done({
        EC: 500,
        EM: error.message,
      });
    }
  },
  getAllComments: async (done) => {
    let comments = await Comment.find({}).populate("product");
    done({
      EC: 0,
      EM: "success",
      data: {
        comments: [...comments],
      },
    });
  },
  replyComment: async (comment_id, reply, done) => {
    try {
      let files = [];
      for (let i = 0; i < reply.files.length; i++) {
        let file = new File({
          link: reply.files[i],
        });
        let savedFile = await file.save({ new: true });
        files.push(savedFile);
      }
      let comment = await Comment.findOne({ _id: comment_id });
      let pro_id = comment.product;
      let product = await Item.findOne({ _id: pro_id });
      if (!product) product = await Food.findOne({ _id: pro_id });
      let new_reply = new Reply({
        text: reply.text,
        seller: product.seller,
        files: [...files],
        created_at: new Date(),
      });
      let savedReply = await new_reply.save({ new: true });
      await Comment.findOneAndUpdate(
        { _id: comment_id },
        { reply: savedReply._id },
        { useFindAndModify: false }
      );
      done({
        EC: 0,
        EM: "success",
      });
    } catch (error) {
      done({
        EC: 500,
        EM: error.message,
      });
    }
  },
};

module.exports = CommentController;
