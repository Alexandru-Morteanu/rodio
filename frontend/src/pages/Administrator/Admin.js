import Peer from "peerjs";
import React, { useEffect, useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { socket } from "../../App";
import axiosInstance from "../Login/Axios";

function Admin() {
  let localPeerId;
  let [peer, setPeer] = useState(null);
  const [audioElement] = useState(new Audio());
  let [localStream, setLocalStream] = useState();
  let [files, setFiles] = useState();
  let [uploads, setUploads] = useState([]);
  let [users, setUsers] = useState([]);
  let [index, setIndex] = useState(0);
  let [indexLength, setIndexLength] = useState(0);
  const [k, setK] = useState(1);
  const locations = useLocation();
  let history = useHistory();
  let path = locations.pathname.split("/");
  path = path[2];
  useEffect(() => {
    if (localStream) {
      users.forEach((userId, index) => {
        setTimeout(() => {
          peer.call(userId, localStream);
          console.log(localStream);
          console.log("|///|");
        }, (index + 1) * 100);
      });
    }
  }, [localStream]);
  useEffect(() => {
    if (users) {
      users.forEach((userId) => {
        setTimeout(() => {
          peer.call(userId, localStream);
          console.log(userId);
          console.log(localStream);
        }, 1000);
      });
    }
  }, [users]);
  useEffect(() => {
    socket.on("peerId", (id) => {
      setUsers(id);
    });
  }, [socket]);

  useEffect(() => {
    let newpeer = new Peer();
    newpeer.on("open", (id) => {
      localPeerId = id;
      console.log(id);
      socket.emit("joinRoom", path, localPeerId);
    });
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
      localStream = audioElement.captureStream();
      audioElement.volume = 0.05;
      audioElement.play();
      setLocalStream(localStream);
      console.log(users);
    };
    setPeer(newpeer);
  }, []);

  async function handleRefresh() {
    try {
      const res = await axiosInstance.get("/admin");
      const searchResults = res.data.filter((string) => {
        return string.includes(path);
      });
      console.log(searchResults[0]);
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
  let handleFileChange = (event) => {
    setFiles(event.target.files);
  };

  const handleStart = () => {
    if (k === 1) {
      console.log(users);
      users.forEach((userId) => {
        //console.log(localStream);
        peer.call(userId, localStream);
        console.log("send->" + userId);
      });
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
      console.log(formData);
    }
    formData.append("station", path);
    try {
      console.log(formData);
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
      <Link to={`/admin/${path}/sell`}>SELL</Link>
      <Link to="96">96</Link>
    </div>
  );
}

export default Admin;
