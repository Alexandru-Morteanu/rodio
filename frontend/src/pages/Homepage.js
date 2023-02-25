import React, { useEffect, useState } from "react";
import "./Homepage.css";
import { Link, useHistory, useLocation } from "react-router-dom";
import { socket } from "../App";
import Peer from "peerjs";
import { Tooltip } from "@mui/material";
export let localPeerId;
function Homepage() {
  const location = useLocation();
  const path = location.pathname.split("/");
  let [localStream, setLocalStream] = useState();
  let [audioElement, setAudioElement] = useState(new Audio());
  let [k, setK] = useState(0);
  const history = useHistory();
  let [users, setUsers] = useState([]);
  let [peer, setPeer] = useState(null);
  const audioContext = new AudioContext();
  let [stream, setStream] = useState(null);
  useEffect(() => {
    let newpeer = new Peer();
    newpeer.on("open", (id) => {
      console.log(id);
      localPeerId = id;
      socket.emit("joinRoom", path[1], id);
    });
    socket.on("peerId", (id) => {
      users = id;
      setUsers(id);
      console.log(users);
    });
    setPeer(newpeer);
  }, []);
  useEffect(() => {
    if (stream) {
      const sourceNode = audioContext.createMediaStreamSource(stream);
      console.log(sourceNode);
      const analyserNode = audioContext.createAnalyser();
      analyserNode.fftSize = 2048;

      sourceNode.connect(analyserNode);
      const canvas = document.getElementById("visualizer");
      const canvasCtx = canvas.getContext("2d");
      function drawVisualizer() {
        const bufferLength = analyserNode.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        analyserNode.getByteFrequencyData(dataArray);
        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

        const barWidth = (canvas.width / bufferLength) * 2.5;
        let barHeight;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          barHeight = dataArray[i];

          canvasCtx.fillStyle = "rgb(215, 158, 0)";
          canvasCtx.fillRect(
            x,
            canvas.height - barHeight / 2,
            barWidth,
            barHeight / 2
          );

          x += barWidth + 1;
        }

        requestAnimationFrame(drawVisualizer);
      }

      drawVisualizer();
    }
  }, [stream]);
  useEffect(() => {
    console.log("--------");
    if (peer) {
      peer.on("call", (call) => {
        call.answer(localStream);
        console.log("HERE");
        call.on("stream", (stream) => {
          try {
            audioElement.srcObject = stream;
            setStream(stream);
            console.log(audioElement.srcObject);
            audioElement.play();
          } catch (e) {
            console.log(e);
          }
        });
      });
    }
  }, [peer]);
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
  function handleGet() {
    history.push("/signup");
  }
  const items = Array.from({ length: 9 }, (_, index) => (
    <li key={index}>{"~96.6~"}</li>
  ));
  return (
    <div className="containerHome">
      <div className="left">
        <div className="label">
          <div className="logo">
            <b>Horizon</b>
            <b>Radio</b>
          </div>
          <div onClick={handleGet} className="getStart">
            <Link className="get" to="/signup">
              Get Started
            </Link>
          </div>
        </div>
        <canvas id="visualizer"></canvas>
        <div className="top">TOP</div>
        <div className="liderboard">
          <ul>{items}</ul>
          <ul>{items}</ul>
          <ul>{items}</ul>
        </div>
        <div className="buttons">
          <div className="on" onClick={handleOn}>
            <p>ON/OFF</p>
          </div>
          <div className="volume">
            <p>Volume</p>
          </div>
          <div className="next">
            <p>Next</p>
          </div>
        </div>
      </div>
      <div className="right">
        <div className="adds"></div>
        <Tooltip title={"Listeners: " + users.length} placement="top">
          <div className="currentStation">~{path}~</div>
        </Tooltip>
      </div>
    </div>
  );
}

export default Homepage;
