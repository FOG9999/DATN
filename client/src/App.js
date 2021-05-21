import "./App.css";
import LoginBackground from "./components/login/Background";
import HomeContainer from "./components/home/Container";
import { Switch, Route } from "react-router-dom";
import Container from "./components/Seller/SellerManagement/Container";
// import RichTextEditor from "./components/product_detail/details/RichTextEditor";
import ProductDetail from "./components/product_detail/Container";
import CartContainer from "./components/Cart/Container";
import Search from "./components/search/Container";
import BoothRegister from "./components/Seller/BoothRegister/Container";
import ProductRegister from "./components/upload/Container";
import CheckoutContainer from "./components/Checkout/CheckoutContainer";
import { Config } from "./config/Config";
import { toast } from "react-toastify";
import { getCookie } from "./others/functions/Cookie";
import { useEffect } from "react";
import Livestreamer from "./components/Livestream/Sender/Livestreamer";
import Watcher from "./components/Livestream/Receiver/Watcher";
// import { useSelector } from "react-redux";
// import { useEffect } from "react";

var socket = require("socket.io-client")(Config.ResourceServer, {
  withCredentials: "include",
});

function App() {
  // let socket = useSelector((state) => state.user.socket);
  useEffect(() => {
    socket.on("connect_error", () => {
      console.log("error");
    });
    // lắng nghe tin nhắn mới, không cần ToastContainer vì hầu như mọi Component đều đã có
    socket.on("message." + getCookie("user_id"), (data) => {
      const { message, isGroup, conv_name } = data;
      const toast_header = `${message.sender.name} ${
        isGroup ? " trong " + conv_name : ""
      }:\n`;
      const toast_content = message.text ? message.text : "[File]";
      toast.info(toast_header + toast_content);
    });
  }, []);
  return (
    <div className="App">
      <Switch>
        <Route exact path="/sd" component={HomeContainer} />
        <Route
          path="/m/manage/:key"
          render={(props) => <Container {...props} socket={socket} />}
        />
        <Route path="/login" component={LoginBackground} />
        <Route path="/m/cart" component={CartContainer} />
        <Route path="/search/:keyword/:limit" component={Search} />
        <Route path="/prd/:product_id" component={ProductDetail} />
        <Route path="/m/prd/create" component={ProductRegister} />
        <Route path="/m/booth/register" component={BoothRegister} />
        <Route path="/checkout/:ids" component={CheckoutContainer} />
        <Route
          exact
          path="/"
          render={(props) => <Livestreamer {...props} socket={socket} />}
        />
        <Route
          path="/watch/:id"
          render={(props) => <Watcher {...props} socket={socket} />}
        />
      </Switch>
    </div>
  );
}

export default App;
