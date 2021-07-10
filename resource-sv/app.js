const app = require("express")();
const bodyParser = require("body-parser");
const cors = require("cors");
const { uri, port } = require("./config/Config");
const mongoose = require("mongoose");
const ProductRouter = require("./route/ProductRouter");
const UserRouter = require("./route/UserRouter");
const ItemRouter = require("./route/ItemRouter");
const cookieParser = require("cookie-parser");
const OrderRouter = require("./route/OrderRouter");
const AdminRouter = require("./route/AdminRouter");
const ChatRouter = require("./route/ChatRouter");
const ChatController = require("./controller/ChatController");
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const ss = require("socket.io-stream");
const SampleRouter = require("./route/SampleRouter");

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3333"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTION",
    credentials: true,
  })
);

// app.get(
//   "/socket.io",
//   cors({
//     origin: ["http://localhost:3000"],
//     methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTION",
//     credentials: true,
//   }),
//   (req, res) => {
//     res.end();
//   }
// );

// app.post(
//   "/socket.io",
//   cors({
//     origin: ["http://localhost:3000"],
//     methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTION",
//     credentials: true,
//   }),
//   (req, res) => {
//     res.end();
//   }
// );

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use("/product", ProductRouter);
app.use("/user", UserRouter);
app.use("/item", ItemRouter);
app.use("/order", OrderRouter);
app.use("/admin", AdminRouter);
app.use("/chat", ChatRouter);
app.use("/sample", SampleRouter);
mongoose.connect(
  uri,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("Database connected ...");
  }
);

http.listen(port, () => {
  console.log("Resource server is listening on port " + port);
});

const broadcasters = new Map();

// người dùng tạo trên diao giện
app.post("/livestream", (req, res, next) => {
  const { title, id, name } = req.body;
  const broadcaster = req.cookies.user_id;
  if (title && id && broadcaster && !broadcasters.has([broadcaster])) {
    broadcasters.set(`${broadcaster}`, {
      title: title,
      name: name,
      id: id,
      watchers: 1,
      started: false,
      created: new Date().getTime(),
      emotions: {
        likes: 0,
        love: 0,
        haha: 0,
      },
    });
    res.send({
      EC: 0,
      EM: "success",
      data: {
        user: req.cookies.user_id,
        id: id,
      },
    });
  } else
    res.send({
      EC: -1,
      EM: "failed",
    });
});

// được gọi đến khi người dùng load trang livestream -> nếu đã online rồi thì không thể vào lại nữa
app.get("/stream-init", (req, res, next) => {
  const id = req.query.id;
  const user = req.cookies.user_id;
  if (broadcasters.get(`${user}`)) {
    let oldState = broadcasters.get(`${user}`);
    if (oldState.started) {
      res.send({
        EC: -1,
        EM: "stream started",
      });
    } else {
      broadcasters.set(`${user}`, { ...oldState, started: true });
      res.send({
        EC: 0,
        EM: "success",
        data: {
          title: oldState.title,
          id: oldState.id,
          name: oldState.name,
          created: oldState.created,
          emotions: { ...oldState.emotions },
        },
      });
    }
  } else {
    res.send({
      EC: -1,
      EM: "stream not exsit",
    });
  }
});

app.get("/watch-stream", (req, res, next) => {
  const { id } = req.query;
  let found = false;
  broadcasters.forEach((live) => {
    if (live.id === id) {
      found = true;
      res.send({
        EC: 0,
        EM: "success",
        data: {
          title: live.title,
          id: live.id,
          name: live.name,
          created: live.created,
          watchers: live.watchers,
          emotions: { ...live.emotions },
        },
      });
    }
  });
  if (!found) {
    res.send({
      EC: -1,
      EM: "stream not found",
    });
  }
});

io.on("connection", (socket) => {
  console.log(socket.id + " comes...");
  socket.on("message", (data) => {
    console.log(data.data);
  });
  socket.on("disconnect", () => {
    console.log(socket.id + " disconnect");
    io.emit("leaving", socket.id);
  });
  socket.on("listen", (data) => {
    const { new_message, conID } = data;
    ChatController.handleNewMessage(conID, new_message, (rs) => {
      if (rs.EC !== 0) {
        console.log(rs.EM);
      } else {
        const { message, conversation } = rs.data;
        // gửi thông báo cho các thành viên trong cuộc trò chuyện trừ người gửi
        conversation.participants.forEach((p) => {
          if (String(p._id) !== String(message.sender)) {
            io.emit("message." + p._id, {
              conv_name: conversation.name,
              isGroup: conversation.participants.length > 2,
              message: { ...message },
            });
            io.emit("chat." + p._id, {
              conversation: { ...conversation },
            });
          }
          io.emit("room." + p._id, {
            message: { ...message },
          });
        });
      }
    });
  });
  socket.on("seen", (data) => {
    const { user_id, conID } = data;
    ChatController.handleHaveSeenConversation(user_id, conID, (rs) => {
      if (rs.EC !== 0) {
        console.log(rs.EM);
      }
    });
  });
  // livestream handler
  socket.on("broadcasters", (streamID) => {
    console.log("Phòng stream: " + streamID);
    socket.emit(`watchers.${streamID}`, socket.id);
  });
  // có người xem mới
  socket.on("watchers", (broadcasterID, streamID) => {
    console.log(
      "Nguoi xem tai phong co broadcaster: " +
        broadcasterID +
        " co id: " +
        socket.id
    );
    let watchers = 0;
    broadcasters.forEach((br, key, map) => {
      if (br.id === streamID) {
        broadcasters.set(key, {
          ...br,
          watchers: br.watchers + 1,
        });
        watchers = br.watchers + 1;
      }
    });
    io.emit(`broadcaster.watchers.${broadcasterID}`, socket.id);
    io.emit(`watchers.add.${broadcasterID}`, watchers);
  });
  // broadcaster gửi sdp
  socket.on("sdp", (broadcasterID, broasdcastSDP) => {
    console.log("SDP: " + broasdcastSDP + ", Broadcaster: " + broadcasterID);
    io.emit(`watchers.sdp.${broadcasterID}`, broasdcastSDP);
  });
  // watcher gửi sdp
  socket.on("SDPanswer", (broadcasterID, watcherSDP) => {
    console.log("SDP cua nguoi xem: " + socket.id + " la: " + watcherSDP);
    io.emit(`broadcaster.sdp.${broadcasterID}`, socket.id, watcherSDP);
  });
  // broadcaster gửi candidate
  socket.on("candidates", (broadcasterID, broadcasterCandidate) => {
    console.log(
      "Broadcaster " +
        broadcasterID +
        " co candidate: " +
        JSON.stringify(broadcasterCandidate)
    );
    io.emit(`watchers.candidates.${broadcasterID}`, broadcasterCandidate);
  });
  // watcher gửi candidate
  socket.on("watchers.candidates", (broadcasterID, watcherCandidate) => {
    console.log(
      "Watcher " +
        socket.id +
        " tai broadcaster: " +
        broadcasterID +
        " co candidate: " +
        JSON.stringify(watcherCandidate)
    );
    io.emit(
      `broadcaster.candidates.${broadcasterID}`,
      socket.id,
      watcherCandidate
    );
  });
  //stream kết thúc
  socket.on("destroy", (broadcaster) => {
    broadcasters.delete(broadcaster);
    console.log("Livestream kết thúc");
  });
  // lắng nghe các tin nhắn trên kênh livestream
  socket.on("stream.messages", (streamID, message) => {
    console.log("Gửi tin nhắn đến phòng stream: " + streamID);
    io.emit("stream.messages." + streamID, message);
  });
  // lắng nghe sự kiện broadcaster thông báo cho các watcher khi có 1 ng rời đi
  socket.on("watchers.leaving", (broadcasterID) => {
    io.emit("watchers.leaving." + broadcasterID);
  });
  // lắng nghe sự kiện tương tác của watcher vs livestream (like, heart,..)
  socket.on("actions", (broadcasterID, streamID, actionID) => {
    console.log("Watcher tương tác " + actionID);
    let emo = actionID === 0 ? "likes" : actionID === 1 ? "love" : "haha";
    broadcasters.forEach((br, key) => {
      if (br.id === streamID) {
        broadcasters.set(key, {
          ...br,
          emotions: {
            ...br.emotions,
            [emo]: br.emotions[emo] + 1,
          },
        });
      }
    });
    io.emit(`actions.${broadcasterID}`, actionID);
  });
});
