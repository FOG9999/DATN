const ChatController = require("../controller/ChatController");
const { authen } = require("../function/Middleware");
const ChatRouter = require("express").Router();

ChatRouter.post("/create-conv-samples", (req, res, next) => {
  ChatController.createConversationSamples((rs) => {
    res.send(rs);
  });
});

ChatRouter.get("/user-list/:role", authen, (req, res, next) => {
  ChatController.getUserConversations(req.cookies.user_id, (rs) => {
    res.send(rs);
  });
});

ChatRouter.put("/create-message-samples", (req, res, next) => {
  ChatController.createMessageSamples((rs) => {
    res.send(rs);
  });
});

ChatRouter.get("/conversation/:role", authen, (req, res, next) => {
  const { id, page, pagesize } = req.query;
  ChatController.getMessagesInConversation(
    req.cookies.user_id,
    id,
    page,
    pagesize,
    (rs) => {
      res.send(rs);
    }
  );
});

ChatRouter.post("/check-exsit", (req, res, next) => {
  ChatController.checkConverExsit(req.body.participants, (rs) => {
    res.send(rs);
  });
});

ChatRouter.post("/create-conversation", (req, res, next) => {
  const { participants, name } = req.body;
  ChatController.creatNewConversation(participants, name, (rs) => {
    res.send(rs);
  });
});

ChatRouter.get("/search", (req, res, next) => {
  ChatController.searchOnConversations(
    req.query.keyword,
    req.cookies.user_id,
    (rs) => {
      res.send(rs);
    }
  );
});

module.exports = ChatRouter;
