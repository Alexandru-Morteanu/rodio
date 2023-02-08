import React, { useState } from "react";
import axiosInstance from "../Login/Axios";

function MarketPlace() {
  const [stationName, setStationName] = useState("");
  let arrStations = [];
  let [stations, setStations] = useState([]);

  async function handleCreateStation(e) {
    e.preventDefault();
    try {
      const res = await axiosInstance.post("/market ", {
        stationName,
      });
    } catch (error) {
      alert("wrong details");
      console.log(error);
    }
  }
  async function handleRefresh(e) {
    e.preventDefault();
    try {
      const res = await axiosInstance.get("/market");
      res.data.forEach((element) => {
        setStations([arrStations]);
        arrStations.push(element.station);
      });
    } catch (error) {
      alert("wrong details");
      console.log(error);
    }
  }

  return (
    <div>
      MarketPlace
      <input
        onChange={(e) => {
          setStationName(e.target.value);
        }}
        placeholder="Station"
      />
      <button onClick={handleCreateStation}>CREATE</button>
      <button onClick={handleRefresh}>REFRESH</button>
      <div>
        {stations.map((station, index) => (
          <div key={index}>{station}</div>
        ))}
      </div>
    </div>
  );
}

export default MarketPlace;
