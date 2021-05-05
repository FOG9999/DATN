import "./App.css";
import LoginBackground from "./components/login/Background";
import HomeContainer from "./components/home/Container";
import { Switch, Route } from "react-router-dom";
import Container from "./components/Seller/SellerManagement/Container";
// import RichTextEditor from "./components/product_detail/details/RichTextEditor";
import ProductDetail from "./components/product_detail/Container";
import CartContainer from "./components/Cart/Container";

function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/" component={HomeContainer} />
        <Route path="/m/manage" component={Container} />
        <Route path="/login" component={LoginBackground} />
        <Route path="/m/cart" component={CartContainer} />
        <Route path="/prd/:product_id" component={ProductDetail} />
      </Switch>
    </div>
  );
}

export default App;
