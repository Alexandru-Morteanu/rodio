import React, { useEffect, useState } from "react";
import "./App.css";
import Homepage from "./pages/Homepage";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import PrivateRoute from "./pages/Login/PrivateRoute";
import Admin from "./pages/Administrator/Admin";
import Login from "./pages/Login/Login";
import SignUp from "./pages/Login/SignUp";
import io from "socket.io-client";
import MarketPlace from "./pages/MarketPlace/MarketPlace";
import axiosInstance from "./pages/Login/Axios";
import AdminMAIN from "./pages/Administrator/AdminMAIN";
import AdminSELL from "./pages/Administrator/AdminSELL";
import StripeBegin from "./pages/Administrator/AdminStripe/StripeBegin";
export const socket = new io("http://localhost:8080/");
export let stations = [];
let setStations = () => {};
function App() {
  [stations, setStations] = useState([]);
  useEffect(() => {
    handleRefresh();
    console.log(socket);
  }, []);
  async function handleRefresh() {
    try {
      const res = await axiosInstance.get("/");
      setStations(res.data);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="App">
      <div className="container">
        <Router>
          <Switch>
            {stations.map((path, index) => (
              <Route
                path={`/${path.station}`}
                component={Homepage}
                key={index}
              />
            ))}
            <Route path="/login" component={Login} />
            <Route path="/signup" component={SignUp} />
            <Route path="/market" key="key" component={MarketPlace} />
            <Route exact path="/">
              <Redirect to="/96" />
            </Route>
            <PrivateRoute exact path="/admin/stripe" component={StripeBegin} />
            <PrivateRoute exact path="/admin" component={AdminMAIN} />
            {stations.map((path) => (
              <PrivateRoute
                exact
                path={`/admin/${path.station}`}
                component={Admin}
                key={path.station}
              />
            ))}
            {stations.map((path) => (
              <PrivateRoute
                path={`/admin/${path.station}/sell`}
                component={AdminSELL}
                key={path.station}
              />
            ))}
          </Switch>
        </Router>
      </div>
    </div>
  );
}
export default App;
