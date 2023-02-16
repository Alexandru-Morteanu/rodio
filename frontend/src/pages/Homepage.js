import React, { useEffect, useRef, useState } from "react";
import "./Homepage.css";
import { Link, useLocation } from "react-router-dom";
import { peer, socket } from "../App";
export let localPeerId;
function Homepage() {
  const location = useLocation();
  const path = location.pathname.split("/");
  let [localStream, setLocalStream] = useState();
  let [audioElement, setAudioElement] = useState(new Audio());
  let [k, setK] = useState(0);

  peer.on("call", (call) => {
    call.answer(localStream);
    console.log("HERE");
    call.on("stream", (stream) => {
      try {
        audioElement.srcObject = stream;
        console.log(audioElement.srcObject);
        audioElement.play();
      } catch (e) {
        console.log(e);
      }
    });
  });
  useEffect(() => {
    console.log("New client connected");
    console.log(path[1]);
  }, []);
  peer.on("open", (id) => {
    localPeerId = id;
    socket.emit("joinRoom", path[1], localPeerId);
    //socket.send(JSON.stringify({ id: localPeerId, chanel: path[1] }));
  });
  socket.on("peerId", (id) => {
    console.log(id);
  });
  const handleOn = () => {
    if (k == 1) {
      audioElement.pause();
      setK(0);
    } else {
      console.log(audioElement.srcObject);
      audioElement.play();
      setK(1);
    }
  };
  return (
    <div className="containerHome">
      <div>
        <b>RODIO</b>
        <Link to="/control"> CONTROL STATION </Link>
        <div className="vizualizer"></div>
        <button onClick={handleOn}>ON/OFF</button>
        <button>Volume</button>
        <button>Next</button>
        <div>{path}</div>
      </div>
      <div>
        <div className="adds"></div>
        <div className="currentStation"></div>
      </div>
    </div>
  );
}

export default Homepage;
