import React, { useEffect, useState } from "react";
import axiosInstance from "../Login/Axios";

function MarketPlace() {
  const [stationName, setStationName] = useState("");
  let [stations, setStations] = useState([]);

  async function handleCreateStation(e) {
    e.preventDefault();
    try {
      const res = await axiosInstance.post("/market ", {
        stationName,
      });
      handleRefresh();
    } catch (error) {
      alert("wrong details");
      console.log(error);
    }
  }

  useEffect(() => {
    handleRefresh();
  }, []);

  async function handleRefresh() {
    try {
      const res = await axiosInstance.get("/market");
      setStations(res.data);
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
          <div key={index}>{station.station}</div>
        ))}
      </div>
    </div>
  );
}

export default MarketPlace;
