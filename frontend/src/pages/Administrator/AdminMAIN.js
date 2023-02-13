import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axiosInstance from "../Login/Axios";

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
      history.push(`/admin/${station}`, { state: station });
    } catch (e) {
      console.log(e);
    }
  }
  return (
    <div>
      AdminMAIN
      {stations.map((station) => (
        <button
          onClick={() => {
            handleStation(station);
          }}
          key={station}
        >
          {station}
        </button>
      ))}
    </div>
  );
}

export default AdminMAIN;
