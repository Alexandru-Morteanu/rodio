import React, { useEffect, useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { peer, socket } from "../../App";
import axiosInstance from "../Login/Axios";

function Admin({ location }) {
  let localPeerId;
  const [audioElement] = useState(new Audio());
  let [localStream, setLocalStream] = useState();
  let [files, setFiles] = useState();
  let [uploads, setUploads] = useState([]);
  let users = [];
  let [index, setIndex] = useState(0);
  let [indexLength, setIndexLength] = useState(0);
  const [k, setK] = useState(1);
  const locations = useLocation();
  let history = useHistory();
  let path = locations.pathname.split("/");
  path = path[2];

  useEffect(() => {
    handleRefresh();
    audioElement.onended = async () => {
      if (index < indexLength - 1) {
        index++;
      } else {
        index = 0;
      }
      console.log(index);
      const res = await axiosInstance.get("/upload", {
        params: {
          station: path,
          index: index,
        },
        responseType: "blob",
      });
      audioElement.src = URL.createObjectURL(res.data);
      audioElement.volume = 0.05;
      audioElement.currentTime = 215;
      setLocalStream(audioElement.captureStream());
      console.log(audioElement.captureStream());
      audioElement.play();
    };
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
      console.log(index);
      if (index === 0) {
        const fileRes = await axiosInstance.get("/upload", {
          params: {
            station: path,
            index: index,
          },
          responseType: "blob",
        });
        audioElement.src = URL.createObjectURL(fileRes.data);
        audioElement.currentTime = 215;
        audioElement.volume = 0.05;
        setLocalStream(audioElement.captureStream());
      }
      const req = await axiosInstance.get("/uploads", {
        params: {
          station: path,
        },
      });
      indexLength = req.data.indexLength;
      console.log(indexLength);
      setUploads(req.data.names);
    } catch (error) {
      //alert("wrong details");
      console.log(error);
    }
  }

  peer.on("open", (id) => {
    localPeerId = id;
  });

  let handleFileChange = (event) => {
    setFiles(event.target.files);
  };

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
    for (let i = 0; i < files.length; i++) {
      formData.append("audio", files[i]);
    }
    formData.append("station", path);
    try {
      const res = await axiosInstance.post("/upload", formData);
      //audioElement.play();
      handleRefresh();
      try {
        audioElement.play();
      } catch (e) {
        console.log(e);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleDeleteSong(index) {
    try {
      const res = await axiosInstance.post("/deletesong", {
        station: path,
        index: index,
      });
      handleRefresh();
      console.log(index);
    } catch (e) {
      console.log(e);
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

  // socket.onmessage = (message) => {
  //   let data = JSON.parse(message.data);
  //   console.log(data);
  //   // console.log(path);
  //   // if (path === data.chanel) {
  //   //   users.push(data.id);
  //   //   peer.call(data.id, localStream);
  //   //   console.log(localStream);
  //   // }
  // };

  return (
    <div>
      Admin
      <button onClick={handleLogout}>Log Out</button>
      <button onClick={handleDeposit}>Deposit</button>
      <button onClick={handleStart}>Start</button>
      <input type="file" webkitdirectory="true" onChange={handleFileChange} />
      {uploads.map((upload, index) => (
        <div key={index}>
          {upload}
          <button onClick={() => handleDeleteSong(index)}>delete</button>
        </div>
      ))}
      <Link to="96">96</Link>
    </div>
  );
}

export default Admin;
