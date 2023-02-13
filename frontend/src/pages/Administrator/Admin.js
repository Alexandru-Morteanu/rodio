import React, { useEffect, useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { peer, socket } from "../../App";
import { localPeerId as remotePeerId } from "../Homepage";
import axiosInstance from "../Login/Axios";

function Admin({ location }) {
  let localPeerId;
  const [audioElement] = useState(new Audio());
  let [localStream, setLocalStream] = useState();
  let [files, setFiles] = useState();
  const [k, setK] = useState(1);
  const locations = useLocation();
  let history = useHistory();
  let path = locations.pathname.split("/");
  path = path[2];

  useEffect(() => {
    handleRefresh();
  }, []);

  async function handleRefresh() {
    try {
      const res = await axiosInstance.get("/admin");
      const searchResults = res.data.filter((string) => {
        return string.includes(path);
      });
      if (searchResults[0]) {
        console.log("exist");
      } else {
        console.log("not found");
        history.push("/96");
      }
    } catch (error) {
      alert("wrong details");
      console.log(error);
    }
  }

  peer.on("open", (id) => {
    localPeerId = id;
    console.log(localPeerId);
  });
  let handleFileChange = (event) => {
    setFiles(event.target.files);
    localStream = URL.createObjectURL(event.target.files[0]);
    audioElement.src = localStream;
    audioElement.volume = 0.2;
    setLocalStream(audioElement.captureStream());
    console.log(localStream);
  };
  audioElement.addEventListener("ended", () => {
    localStream = window.URL.createObjectURL(files[1]);
    audioElement.src = localStream;
    console.log(localStream);
    audioElement.play();
  });
  const handleStart = () => {
    if (k == 1) {
      audioElement.play();
      setK(0);
    } else {
      audioElement.pause();
      setK(1);
    }
  };

  async function handleDeposit() {
    const formData = new FormData();
    formData.append("audio", files[0]);
    try {
      const res = await axiosInstance.post("/upload", formData);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleLogout() {
    try {
      localStorage.removeItem("token");
      console.log("logout");
    } catch (e) {
      console.log(e);
    }
  }

  socket.onmessage = (message) => {
    let data = JSON.parse(message.data);
    console.log(data.chanel);
    console.log(location);
    if (location.state.state === data.chanel) {
      peer.call(data.id, localStream);
    }
  };

  return (
    <div>
      Admin
      <button onClick={handleLogout}>Log Out</button>
      <button onClick={handleDeposit}>Deposit</button>
      <button onClick={handleStart}>Start</button>
      <input type="file" onChange={handleFileChange} />
      <Link to="96">96</Link>
    </div>
  );
}

export default Admin;
