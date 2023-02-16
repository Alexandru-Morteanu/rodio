import React, { useEffect, useState } from "react";
import "./Homepage.css";
import { Link, useLocation } from "react-router-dom";
import { peer, socket } from "../App";
export let localPeerId;
function Homepage() {
  const location = useLocation();
  const path = location.pathname.split("/");
  let [local, setLocal] = useState();
  let [audioElement, setAudioElement] = useState(new Audio());
  let [localStream, setLocalStream] = useState();
  let [k, setK] = useState(0);
  const val = React.useRef();
  peer.on("call", (call) => {
    call.answer(localStream);
    call.on("stream", (stream) => {
      //console.log(stream);
      audioElement.srcObject = stream;
    });
  });
  peer.on("open", (id) => {
    console.log("Connected with ID:", id);
    const room = "my-room";
    const conn = peer.join(room);

    conn.on("open", () => {
      console.log("Joined room:", room);
    });
  });
  // peer.on("open", (id) => {
  //   localPeerId = id;
  //   setLocal(id);
  //   console.log(localPeerId);
  //   //socket.send(JSON.stringify({ id: localPeerId, chanel: path[1] }));
  // });

  const handleOn = () => {
    if (k == 1) {
      audioElement.pause();
      setK(0);
    } else {
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
