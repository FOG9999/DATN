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

io.on("connection", (socket) => {
  console.log(socket.id + "comes...");
  socket.on("message", (data) => {
    console.log(data.data);
  });
  socket.on("disconnect", () => {
    console.log("disconnect");
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
});
