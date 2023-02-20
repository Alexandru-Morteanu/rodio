import React, { useEffect, useRef, useState } from "react";
import "./Homepage.css";
import { Link, useLocation } from "react-router-dom";
import { socket } from "../App";
import Peer from "peerjs";
import moment from "moment";
export let localPeerId;
function Homepage() {
  let [peer, setPeer] = useState(null);
  useEffect(() => {
    let newpeer = new Peer();
    newpeer.on("open", (id) => {
      console.log(id);
      localPeerId = id;
      socket.emit("joinRoom", path[1], id);
    });
    socket.on("peerId", (id) => {
      users = id;
      console.log(users);
    });
    setPeer(newpeer);
  }, []);
  useEffect(() => {
    console.log("--------");
    if (peer) {
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
    }
  }, [peer]);
  let users = [];
  const location = useLocation();
  const path = location.pathname.split("/");
  let [localStream, setLocalStream] = useState();
  let [audioElement, setAudioElement] = useState(new Audio());
  let [k, setK] = useState(0);
  useEffect(() => {
    console.log("New client connected");
    console.log(path[1]);
    return () => {};
  }, []);

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
