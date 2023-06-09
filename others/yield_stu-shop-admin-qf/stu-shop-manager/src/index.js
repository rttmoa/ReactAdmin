import React from "react";
import ReactDOM from "react-dom";
import {  HashRouter as Router,  Switch,  Route,  Redirect  } from "react-router-dom";
import { Provider } from "react-redux";
import "antd/dist/antd.css";
import "./index.css";
import store from "./store";
import App from "./App";
import { mainRoutes } from "./routes";
import * as serviceWorker from "./serviceWorker";



ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Switch>
        <Route path="/admin" render={routeProps => {
          return <App {...routeProps} />
        }} />
        {mainRoutes.map(route => {
          return <Route key={route.path} {...route} />;
        })}
        <Redirect to="/admin" from="/" />
        <Redirect to="/404" />
      </Switch>
    </Router>
  </Provider>,
  document.getElementById("root")
);

serviceWorker.unregister();
