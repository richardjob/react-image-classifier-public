import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import "firebase/auth";

import Login from "./auth/Login";
import PrivateRoute from "./auth/helper/PrivateRoutes";
import Home from "./core/Home";
import Result from "./core/Result";

const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <PrivateRoute path="/" exact component={Home}></PrivateRoute>
        <PrivateRoute path="/result" exact component={Result}></PrivateRoute>
        <Route path="/login" exact component={Login}></Route>
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
