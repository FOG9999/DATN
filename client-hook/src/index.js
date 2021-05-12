import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { createStore, applyMiddleware } from "redux";
import { persistCombineReducers, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import { GeneralReducer } from "./redux/reducers/GeneralReducer";
import { UserReducer } from "./redux/reducers/UserReducer";

const persistConfig = {
  key: "root",
  storage,
};

const store = createStore(
  persistCombineReducers(persistConfig, {
    user: UserReducer,
    general: GeneralReducer,
  }),
  applyMiddleware(thunk)
);

const persistor = persistStore(store);

store.subscribe(() => console.log(store.getState()));

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </PersistGate>
  </Provider>,
  document.getElementById("root")
);
