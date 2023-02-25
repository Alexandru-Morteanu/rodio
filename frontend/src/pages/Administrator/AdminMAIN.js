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
      const res = await axiosInstance.get("/admin");
      setStations(res.data);
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
    </div>
  );
}

export default AdminMAIN;
