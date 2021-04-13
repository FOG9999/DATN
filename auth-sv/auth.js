const express = require("express");
const body_parser = require("body-parser");
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const { uri, port } = require("./config/Config");

const UserController = require("./controller/UserController");
const UserRouter = require("./router/UserRouter");
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

app.use(cors());
app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/user", UserRouter);

app.listen(port, () => {
  console.log("Auth server is listening on port " + port);
});
