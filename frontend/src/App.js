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
import ControlStation from "./pages/ControlStation/ControlStation";
import Peer from "peerjs";
import MarketPlace from "./pages/ControlStation/MarketPlace";
import axiosInstance from "./pages/Login/Axios";
import AdminMAIN from "./pages/Administrator/AdminMAIN";
export const peer = new Peer();
// export const socket = new WebSocket("ws://localhost:8080");
function App() {
  let [stations, setStations] = useState([]);
  useEffect(() => {
    handleRefresh();
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
            {stations.map((path) => (
              <Route
                path={`/${path.station}`}
                component={Homepage}
                key={path.station}
              />
            ))}
            <Route path="/control" component={ControlStation} />
            <Route path="/login" component={Login} />
            <Route path="/signup" component={SignUp} />
            <Route path="/market" key="key" component={MarketPlace} />
            <PrivateRoute exact path="/admin" component={AdminMAIN} />
            {stations.map((path) => (
              <PrivateRoute
                path={`/admin/${path.station}`}
                component={Admin}
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
