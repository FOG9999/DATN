const express = require("express");
const body_parser = require("body-parser");
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const { uri, port } = require("./config/Config");

const UserController = require("./controller/UserController");
const UserRouter = require("./router/UserRouter");
const AdminRouter = require("./router/AdminRouter");

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

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3333"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTION",
    credentials: true,
  })
);
app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/user", UserRouter);
app.use("/admin", AdminRouter);

app.listen(port, () => {
  console.log("Auth server is listening on port " + port);
});
