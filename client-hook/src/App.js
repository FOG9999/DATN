import "./App.css";
import LoginContainer from "./components/general/login/LoginContainer";
import { Switch, Route } from "react-router-dom";
import AdminContainer from "./components/admin/AdminContainer";

function App() {
  return (
    <Switch>
      <Route exact path="/" component={LoginContainer} />
      <Route path="/admin" component={AdminContainer} />
    </Switch>
  );
}

export default App;
