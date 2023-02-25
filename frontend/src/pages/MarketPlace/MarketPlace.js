import { Button, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axiosInstance from "../Login/Axios";
import "./MarketPlace.css";

const CssTextField = styled(TextField)({
  "& label.Mui-focused": {
    color: "black",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "black",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "black",
    },
    "&:hover fieldset": {
      borderColor: "black",
    },
    "&.Mui-focused fieldset": {
      borderColor: "black",
    },
  },
});
function MarketPlace() {
  const [stationName, setStationName] = useState("");
  let [stations, setStations] = useState([]);
  let history = useHistory();
  async function handleCreateStation(e) {
    e.preventDefault();
    try {
      const res = await axiosInstance.post("/market/add", {
        stationName,
      });
      handleRefresh();
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    handleRefresh();
  }, []);
  async function handleGiveStation(station) {
    try {
      const token = localStorage.getItem("token");
      console.log(token);
      const res = await axiosInstance.post("/market/status", {
        station,
        token,
      });
      if (res.status === 201) {
        history.push("/admin", { state: res.data });
      } else {
        console.log("red");
      }
    } catch (error) {
      alert("wrong");
      console.log(error);
    }
  }
  async function handleRefresh() {
    try {
      const res = await axiosInstance.get("/market/add");
      setStations(res.data);
    } catch (error) {
      alert("wrong details");
      console.log(error);
    }
  }
  return (
    <div className="containerer">
      <b className="name">MarketPlace</b>
      <div className="containerCards">
        {stations.map((station) => (
          <div
            onClick={() => handleGiveStation(station.station)}
            className="stationCard"
            style={{
              background: station.status,
            }}
            key={station.station}
          >
            ~{station.station}~
          </div>
        ))}
      </div>
      <CssTextField
        onChange={(e) => {
          setStationName(e.target.value);
        }}
        label="Station"
        id="custom-css-outlined-input"
        sx={{
          height: "90px",
        }}
      />
      <Button
        onClick={handleCreateStation}
        variant="contained"
        sx={{
          height: "55px",
          backgroundColor: "black",
          "&:hover": { backgroundColor: "black" },
        }}
      >
        CREATE
      </Button>
    </div>
  );
}

export default MarketPlace;
