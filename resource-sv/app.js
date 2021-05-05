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

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTION",
    credentials: true,
  })
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use("/product", ProductRouter);
app.use("/user", UserRouter);
app.use("/item", ItemRouter);
app.use("/order", OrderRouter);

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

app.listen(port, () => {
  console.log("Resource server is listening on port " + port);
});
