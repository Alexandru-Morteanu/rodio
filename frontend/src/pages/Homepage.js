import React, { useEffect, useRef, useState } from "react";
import "./Homepage.css";
import { Link, useHistory, useLocation, useRouteMatch } from "react-router-dom";
import { socket, stations } from "../App";
import { styled, useTheme } from "@mui/material/styles";
import FastRewindRounded from "@mui/icons-material/FastRewindRounded";
import PlayArrowRounded from "@mui/icons-material/PlayArrowRounded";
import FastForwardRounded from "@mui/icons-material/FastForwardRounded";
import PauseRounded from "@mui/icons-material/PauseRounded";
import Peer from "peerjs";
import { Box, IconButton, Tooltip } from "@mui/material";
import { red } from "@mui/material/colors";
export let localPeerId;
const Widget = styled("div")(({ theme }) => ({
  padding: 16,
  borderRadius: 16,
  width: 200,
  maxWidth: "20%",
  margin: "auto",
  position: "relative",
  zIndex: 1,
  backgroundColor: red,
  backdropFilter: "blur(40px)",
}));
function Homepage() {
  const [paused, setPaused] = useState(false);
  const location = useLocation();
  const [path, setPath] = useState(location.pathname.split("/"));
  const [index, setIndex] = useState(
    stations.findIndex((station) => station.station === path[1])
  );
  let [localStream, setLocalStream] = useState();
  let [audioElement1] = useState(new Audio());
  let [audioElement2] = useState(new Audio());
  let [low, setLow] = useState(0);
  let [mid, setMid] = useState(0);
  let [high, setHigh] = useState(0);
  let [gain, setGain] = useState(0);
  let [k, setK] = useState(0);
  let [streamPrimit, setStreamPrimit] = useState(0);
  const history = useHistory();
  let [users, setUsers] = useState([]);
  let [peer, setPeer] = useState(null);
  const audioContext = useRef(new AudioContext());
  const sourceNode = useRef(null);
  const lowNode = useRef(null);
  const midNode = useRef(null);
  const highNode = useRef(null);
  const gainNode = useRef(null);
  let [stream, setStream] = useState(null);
  let match = useRouteMatch("/96");
  useEffect(() => {
    if (!paused && audioElement1.srcObject) {
      audioElement1.play();
    } else if (paused && audioElement1.srcObject) {
      audioElement1.pause();
    }
  }, [paused]);
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
    socket.on("low", (low) => {
      setLow(low);
    });
    socket.on("mid", (mid) => {
      setMid(mid);
    });
    socket.on("high", (high) => {
      setHigh(high);
    });
    socket.on("gain", (gain) => {
      setGain(gain);
    });
    setPeer(newpeer);
    console.log(index);
  }, []);
  useEffect(() => {
    if (lowNode.current) {
      lowNode.current.gain.value =
        low < 0
          ? 20 * Math.log10(low * -1) * -1
          : low === 0
          ? 0
          : 20 * Math.log10(low);
      console.log("low: " + low);
    }
  }, [low]);
  useEffect(() => {
    if (midNode.current) {
      midNode.current.gain.value =
        mid < 0
          ? 20 * Math.log10(mid * -1) * -1
          : mid === 0
          ? 0
          : 20 * Math.log10(mid);
      console.log("mid: " + mid);
    }
  }, [mid]);
  useEffect(() => {
    if (highNode.current) {
      const targetGain =
        high < 0
          ? 20 * Math.log10(high * -1) * -1
          : high === 0
          ? 0
          : 20 * Math.log10(high);
      const duration = 0.1;
      const currentTime = audioContext.current.currentTime;

      highNode.current.gain.cancelScheduledValues(currentTime);
      highNode.current.gain.setValueAtTime(
        highNode.current.gain.value,
        currentTime
      );
      highNode.current.gain.exponentialRampToValueAtTime(
        targetGain,
        currentTime + duration
      );

      console.log("high: " + high);
    }
  }, [high]);
  useEffect(() => {
    if (highNode.current) {
      sourceNode.current.connect(lowNode.current);
      lowNode.current.connect(midNode.current);
      midNode.current.connect(highNode.current);
      highNode.current.connect(audioContext.current.destination);
    }
  }, [gain]);

  useEffect(() => {
    if (!lowNode.current && sourceNode.current) {
      lowNode.current = audioContext.current.createBiquadFilter();
      lowNode.current.type = "peaking";
      lowNode.current.frequency.value = 100;
      lowNode.current.Q.value = 0.5;

      midNode.current = audioContext.current.createBiquadFilter();
      midNode.current.type = "peaking";
      midNode.current.frequency.value = 1000;
      midNode.current.Q.value = 0.5;

      highNode.current = audioContext.current.createBiquadFilter();
      highNode.current.type = "peaking";
      highNode.current.frequency.value = 10000;
      highNode.current.Q.value = 0.5;

      sourceNode.current.connect(lowNode.current);
      lowNode.current.connect(midNode.current);
      midNode.current.connect(highNode.current);
      highNode.current.connect(audioContext.current.destination);
    }
  }, [sourceNode.current]);

  useEffect(() => {
    if (stream) {
      sourceNode.current = audioContext.current.createMediaStreamSource(stream);
      console.log(sourceNode.current);

      const analyserNode = audioContext.current.createAnalyser();
      analyserNode.fftSize = 2048;

      sourceNode.current.connect(analyserNode);
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
        call.on("stream", (stream) => {
          try {
            if (call.metadata === "stream1") {
              console.log("stream1 modified");
              audioElement1.srcObject = stream;
              setStream(stream);
              audioElement1.play();
              streamPrimit = 1;
            } else if (call.metadata === "stream2") {
              console.log("stream2 modified");
              audioElement2.srcObject = stream;
              setStream(stream);
              audioElement2.play();
              streamPrimit = 0;
            }
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
  useEffect(() => {
    //history.push(path[1])
  }, [path]);
  function prevPath() {
    try {
      if (index === 0) {
        setIndex(stations.length - 1);
      } else {
        setIndex(index - 1);
      }
      console.log(index);
    } catch {}
  }
  function nextPath() {
    try {
      if (index === stations.length - 1) {
        setIndex(0);
      } else {
        setIndex(index + 1);
      }
      console.log(index);
    } catch {}
  }
  useEffect(() => {
    history.push(stations[index].station);
  }, [index]);
  function handleGet() {
    history.push("/signup");
  }
  const items = Array.from({ length: 9 }, (_, index) => (
    <li key={index}>{"~96.6~"}</li>
  ));
  const theme = useTheme();
  const mainIconColor = theme.palette.mode === "dark" ? "#fff" : "#000";
  return (
    <div className="containerHome">
      <div className="left">
        <div className="label">
          <div className="logo">
            <b>SERPAS</b>
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
          <Box sx={{ width: "100%", overflow: "hidden" }}>
            <Widget>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mt: -1,
                }}
              >
                <IconButton onClick={prevPath} aria-label="previous song">
                  <FastRewindRounded
                    fontSize="large"
                    htmlColor={mainIconColor}
                  />
                </IconButton>
                <IconButton
                  aria-label={paused ? "play" : "pause"}
                  onClick={() => setPaused(!paused)}
                >
                  {paused ? (
                    <PlayArrowRounded
                      sx={{ fontSize: "3rem" }}
                      htmlColor={mainIconColor}
                    />
                  ) : (
                    <PauseRounded
                      sx={{ fontSize: "3rem" }}
                      htmlColor={mainIconColor}
                    />
                  )}
                </IconButton>
                <IconButton onClick={nextPath} aria-label="next song">
                  <FastForwardRounded
                    fontSize="large"
                    htmlColor={mainIconColor}
                  />
                </IconButton>
              </Box>
            </Widget>
          </Box>
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
