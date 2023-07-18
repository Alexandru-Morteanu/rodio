import React, { useEffect, useRef, useState } from "react";
import "./Homepage.css";
import { Link, useHistory, useLocation, useRouteMatch } from "react-router-dom";
import { socket, stations } from "../App";
import { styled, useTheme } from "@mui/material/styles";
import Cookies from "js-cookie";
import { v4 as uuidv4 } from "uuid";
import FastRewindRounded from "@mui/icons-material/FastRewindRounded";
import FastForwardRounded from "@mui/icons-material/FastForwardRounded";
import Peer from "peerjs";
import { Box, IconButton, Tooltip } from "@mui/material";
import { red } from "@mui/material/colors";
import PauseBTN from "./LessCode/PauseBTN";
import axiosInstance from "./Login/Axios";
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
  let audioElement1 = useRef(new Audio());
  let audioElement2 = useRef(new Audio());
  let [low1, setLow1] = useState(0);
  let [mid1, setMid1] = useState(0);
  let [high1, setHigh1] = useState(0);
  let [gain1, setGain1] = useState(0);
  let [low2, setLow2] = useState(0);
  let [mid2, setMid2] = useState(0);
  let [high2, setHigh2] = useState(0);
  let [vol1, setVol1] = useState(0);
  let [vol2, setVol2] = useState(0);
  let [k, setK] = useState(0);
  let [streamPrimit, setStreamPrimit] = useState(0);
  const history = useHistory();
  let [users, setUsers] = useState([]);
  let [peer, setPeer] = useState(null);
  const audioTrack1 = useRef(null);
  const audioContext = useRef(new AudioContext());
  const stream1Node = useRef(null);
  const stream2Node = useRef(null);
  const lowNode1 = useRef(null);
  const midNode1 = useRef(null);
  const highNode1 = useRef(null);
  const lowNode2 = useRef(null);
  const midNode2 = useRef(null);
  const highNode2 = useRef(null);
  const gainNode1 = useRef(audioContext.current.createGain());
  const gainNode2 = useRef(audioContext.current.createGain());
  const isNewVisitor = !Cookies.get("visitorId");
  let [stream1, setStream1] = useState(null);
  let [stream2, setStream2] = useState(null);
  let checked = useRef(0);
  useEffect(() => {
    if (!paused && audioElement1.current.srcObject) {
      audioElement1.current.play();
    } else if (paused && audioElement1.current.srcObject) {
      audioElement1.current.pause();
    }
  }, [paused]);

  async function check() {
    if (isNewVisitor && checked.current === 0) {
      checked.current = 1;
      console.log("new");
      const uniqueId = uuidv4();
      Cookies.set("visitorId", uniqueId);
      const res = await axiosInstance.post("/visitors", { station: path[1] });
      console.log(res.data);
    } else {
      console.log("old");
    }
  }

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
    const eventHandlers = {
      low1: setLow1,
      mid1: setMid1,
      high1: setHigh1,
      low2: setLow2,
      mid2: setMid2,
      high2: setHigh2,
      vol1: setVol1,
      vol2: setVol2,
    };

    Object.entries(eventHandlers).forEach(([eventName, handler]) => {
      socket.on(eventName, (data) => {
        handler(data);
      });
    });
    setPeer(newpeer);
    check();
  }, []);

  useEffect(() => {
    if (gainNode1.current) {
      gainNode1.current.gain.value = vol1;
    }
  }, [vol1]);
  useEffect(() => {
    if (gainNode2.current) {
      gainNode2.current.gain.value = vol2;
    }
  }, [vol2]);

  useEffect(() => {
    console.log(audioElement1.current.srcObject);
  }, [audioElement1.current.srcObject]);

  function updateNodeGain(node, value) {
    if (node.current) {
      node.current.gain.value =
        value < 0
          ? 20 * Math.log10(value * -1) * -1
          : value === 0
          ? 0
          : 20 * Math.log10(value);
    }
  }

  function useNodeEffect(node, value) {
    useEffect(() => {
      updateNodeGain(node, value);
    }, [value]);
  }

  useNodeEffect(lowNode1, low1);
  useNodeEffect(midNode1, mid1);
  useNodeEffect(highNode1, high1);
  useNodeEffect(lowNode2, low2);
  useNodeEffect(midNode2, mid2);
  useNodeEffect(highNode2, high2);

  function createBiquadFilter(audioContext, type, frequency, Q) {
    const filterNode = audioContext.createBiquadFilter();
    filterNode.type = type;
    filterNode.frequency.value = frequency;
    filterNode.Q.value = Q;
    return filterNode;
  }
  useEffect(() => {
    if (stream1Node.current) {
      lowNode1.current = createBiquadFilter(
        audioContext.current,
        "peaking",
        100,
        0.5
      );
      midNode1.current = createBiquadFilter(
        audioContext.current,
        "peaking",
        1000,
        0.5
      );
      highNode1.current = createBiquadFilter(
        audioContext.current,
        "peaking",
        10000,
        0.5
      );
      stream1Node.current.connect(gainNode1.current);
      gainNode1.current.connect(lowNode1.current);
      lowNode1.current.connect(midNode1.current);
      midNode1.current.connect(highNode1.current);
      highNode1.current.connect(audioContext.current.destination);
    }
  }, [stream1Node.current]);
  useEffect(() => {
    if (stream2Node.current) {
      lowNode2.current = createBiquadFilter(
        audioContext.current,
        "peaking",
        100,
        0.5
      );
      midNode2.current = createBiquadFilter(
        audioContext.current,
        "peaking",
        1000,
        0.5
      );
      highNode2.current = createBiquadFilter(
        audioContext.current,
        "peaking",
        10000,
        0.5
      );
      stream2Node.current.connect(gainNode2.current);
      gainNode2.current.connect(lowNode2.current);
      lowNode2.current.connect(midNode2.current);
      midNode2.current.connect(highNode2.current);
      highNode2.current.connect(audioContext.current.destination);
    }
  }, [stream2Node.current]);

  useEffect(() => {
    if (stream1) {
      stream1Node.current =
        audioContext.current.createMediaStreamSource(stream1);
      console.log(stream1Node.current);

      const analyserNode = audioContext.current.createAnalyser();
      analyserNode.fftSize = 2048;

      stream1Node.current.connect(analyserNode);
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
  }, [stream1]);

  useEffect(() => {
    if (stream2) {
      stream2Node.current =
        audioContext.current.createMediaStreamSource(stream2);
    }
  }, [stream2]);

  useEffect(() => {
    console.log("--------");
    if (peer) {
      peer.on("call", (call) => {
        call.answer(localStream);
        call.on("stream", (stream) => {
          try {
            if (call.metadata === "stream1") {
              console.log("stream1 modified");
              audioElement1.current.srcObject = stream;
              setStream1(stream);
              audioElement1.current.play();
              streamPrimit = 1;
            } else if (call.metadata === "stream2") {
              console.log("stream2 modified");
              audioElement2.current.srcObject = stream;
              audioElement2.current.volume = 1;
              setStream2(stream);
              audioElement2.current.play();
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
      Cookies.remove("visitorId");
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
      Cookies.remove("visitorId");
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
                  <FastRewindRounded fontSize="large" htmlColor={"#000"} />
                </IconButton>
                <PauseBTN paused={paused} setPaused={setPaused} />
                <IconButton onClick={nextPath} aria-label="next song">
                  <FastForwardRounded fontSize="large" htmlColor={"#000"} />
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
