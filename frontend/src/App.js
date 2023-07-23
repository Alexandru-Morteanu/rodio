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
import StripeFinal from "./pages/Administrator/AdminStripe/StripeFinal";
import Complete from "./pages/Administrator/AdminStripe/Complete";
// import Navigation from "./pages/LessCode/Navigation";
export const socket = new io("https://serpas1.onrender.com");
export let stations = [];
let setStations = () => {};
function App() {
  [stations, setStations] = useState([]);
  const [containerClass, setContainerClass] = useState(
    window.innerWidth > 700 ? "container" : "container_mobile"
  );
  useEffect(() => {
    handleRefresh();
    console.log(socket);
    const handleResize = () => {
      setContainerClass(
        window.innerWidth > 700 ? "container" : "container_mobile"
      );
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
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
    <div
      className="App"
      style={{ display: "flex", flexDirection: "column", gap: 30 }}
    >
      {/* <Navigation /> */}
      <div
        className={containerClass}
        style={{
          padding: "40px 0",
        }}
      >
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
            <PrivateRoute exact path="/admin/completed" component={Complete} />
            <PrivateRoute exact path="/admin/final" component={StripeFinal} />
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
          </Switch>{" "}
        </Router>
      </div>
    </div>
  );
}
export default App;
