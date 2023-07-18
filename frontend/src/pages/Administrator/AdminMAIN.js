import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axiosInstance from "../Login/Axios";
import Button from "@mui/material/Button";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import "./AdminMAIN.css";
function AdminMAIN() {
  let [stations, setStations] = useState([]);
  let history = useHistory();
  useEffect(() => {
    handleRefresh();
  }, []);
  async function handleRefresh() {
    try {
      if (localStorage.getItem("token")) {
        const res = await axiosInstance.get("/admin");
        setStations(res.data);
      } else {
        history.push("/");
      }
    } catch (e) {
      console.log(e);
    }
  }
  async function handleLogout() {
    try {
      localStorage.removeItem("token");
      console.log("logout");
      handleRefresh();
    } catch (e) {
      console.log(e);
    }
  }

  function handleStripeBegin() {
    try {
      history.push("/admin/stripe");
    } catch (e) {
      console.log(e);
    }
  }
  function handleStation(station) {
    try {
      console.log(station);
      history.push(`/admin/${station}`);
    } catch (e) {
      console.log(e);
    }
  }
  return (
    <div className="containerMAIN">
      <b className="nameAdmin">Admin</b>
      <div className="mystcontainer">
        {stations.map((station) => (
          <div
            className="mystations"
            onClick={() => {
              handleStation(station);
            }}
            key={station}
          >
            {station}
          </div>
        ))}
      </div>
      <Button
        variant="contained"
        startIcon={<ShoppingCartIcon />}
        href="/market"
        style={{
          width: "200px",
          height: "50px",
          backgroundColor: "rgb(215, 158, 0)",
        }}
      >
        Get More
      </Button>
      <Button
        variant="contained"
        component="label"
        style={{ backgroundColor: "black" }}
        onClick={handleStripeBegin}
      >
        Get Paid
      </Button>
      <Button
        variant="contained"
        component="label"
        style={{ backgroundColor: "black" }}
        onClick={handleLogout}
      >
        Log Out
      </Button>
    </div>
  );
}

export default AdminMAIN;
