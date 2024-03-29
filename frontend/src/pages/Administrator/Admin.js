import { Alert, Box, Button, IconButton, Modal } from "@mui/material";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider, useDrop } from "react-dnd";
import Typography from "@mui/material/Typography";
import DeleteIcon from "@mui/icons-material/Delete";
import Peer from "peerjs";
import React, { useEffect, useRef, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { socket } from "../../App";
import axiosInstance from "../Login/Axios";
import "./Admin.css";
import { createCssTextField } from "../MarketPlace/MarketPlace";
import { Equalizer, Melody } from "../LessCode/Equalizer";
import PauseBTN, { SliderVol } from "../LessCode/PauseBTN";
import ClickButton from "../LessCode/ClickButton";
import Visitors from "../LessCode/Visitors";
const WhiteCssTextField = createCssTextField("white");
function Admin() {
  let localPeerId;
  let [peer, setPeer] = useState(null);
  const [index1, setIndex1] = useState(null);
  const [index2, setIndex2] = useState(null);
  const [paused1, setPaused1] = useState(false);
  const [paused2, setPaused2] = useState(false);
  const [vol1, setVol1] = useState(0.5);
  const [vol2, setVol2] = useState(0.5);
  const [audioElement1] = useState(new Audio());
  const [audioElement2] = useState(new Audio());
  const [music, setMusic] = useState("rgb(255,185,0)");
  const [control, setControl] = useState("none");
  const [open, setOpen] = useState(false);
  const [price, setPrice] = useState("");
  const [total, setTotal] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const hiddenFileInput = useRef(null);
  let [localStream] = useState();
  let [localStream1, setLocalStream1] = useState();
  let [localStream2, setLocalStream2] = useState();
  const [paypalEmail, setPayPalEmail] = useState("");
  let [files, setFiles] = useState(null);
  let [uploads, setUploads] = useState([]);
  let [users, setUsers] = useState([]);
  let [indexLength, setIndexLength] = useState(0);
  let [active, setActive] = useState(true);
  const [k, setK] = useState(1);
  const locations = useLocation();
  let history = useHistory();
  let path = locations.pathname.split("/");
  path = path[2];
  useEffect(() => {
    let newpeer = new Peer();
    newpeer.on("open", (id) => {
      localPeerId = id;
      console.log(id);
      socket.emit("joinRoom", path, localPeerId);
    });

    handleRefresh();
    setPeer(newpeer);
  }, []);

  useEffect(() => {
    if (localStream1) {
      console.log(localStream1);
      users.forEach((userId, index) => {
        setTimeout(() => {
          peer.call(userId, localStream1, { metadata: "stream1" });
        }, (index + 1) * 100);
      });
    }
  }, [localStream1]);
  useEffect(() => {
    if (localStream2) {
      console.log(localStream2);
      users.forEach((userId, index) => {
        setTimeout(() => {
          peer.call(userId, localStream2, { metadata: "stream2" });
        }, (index + 1) * 100);
      });
    }
  }, [localStream2]);
  useEffect(() => {
    if (users) {
      users.forEach((userId) => {
        setTimeout(() => {
          peer.call(userId, localStream1, { metadata: "stream1" });
          peer.call(userId, localStream2, { metadata: "stream2" });
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
    console.log(audioElement1);
  }, [audioElement1]);

  async function handleRefresh() {
    try {
      const r = await axiosInstance.get("/sell", {
        params: {
          station: path,
        },
      });
      const re = await axiosInstance.get("/visitors", {
        params: {
          station: path,
        },
      });
      setTotal(re.data);
      setPayPalEmail(r.data.paypalEmail);
      setPrice(r.data.price);
      const res = await axiosInstance.get("/admin");
      const searchResults = res.data.filter((string) => {
        return string.includes(path);
      });
      if (searchResults[0]) {
      } else {
        console.log("not found");
        history.push("/96");
      }
    } catch (error) {
      console.log(error);
    }
  }

  let handleFileChange = (event) => {
    setFiles(event.target.files);
    console.log(event.target.files);
    const uploads = Object.values(event.target.files);
    const uploadNames = uploads.map((file) => file.name);
    console.log(uploadNames);
    setUploads(uploadNames);
  };

  const handleStart = () => {
    if (k === 1) {
      console.log(users);
      users.forEach((userId) => {
        peer.call(userId, localStream1, { metadata: "stream1" });
        peer.call(userId, localStream2, { metadata: "stream2" });
        console.log("send->" + userId);
      });
      audioElement1.play();
      audioElement2.play();
      setK(0);
    } else {
      audioElement1.pause();
      audioElement2.pause();
      setK(1);
    }
  };

  function handleDeleteSong(index) {
    try {
      setUploads((prevUploads) => prevUploads.filter((_, i) => i !== index));
    } catch (e) {
      console.log(e);
    }
  }

  const anchors = document.querySelector(".on-air");
  useEffect(() => {
    if (anchors) {
      anchors.addEventListener("click", () => {
        if (!active) {
          anchors.classList.add("inactive");
          anchors.classList.remove("active");
        } else {
          anchors.classList.add("active");
          anchors.classList.remove("inactive");
        }
        active = !active;
      });
    }
  }, [anchors]);

  useEffect(() => {
    if (!paused1 && !k) {
      audioElement1.play();
    } else {
      audioElement1.pause();
    }
  }, [paused1]);

  useEffect(() => {
    if (!paused2 && !k) {
      audioElement2.play();
    } else {
      audioElement2.pause();
    }
  }, [paused2]);

  useEffect(() => {
    socket.emit("getVol1", vol1, path);
  }, [vol1]);

  useEffect(() => {
    socket.emit("getVol2", vol2, path);
  }, [vol2]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  function handleControl() {
    setControl("rgb(255,185,0)");
    setMusic("none");
  }

  function handleMusic() {
    setControl("none");
    setMusic("rgb(255,185,0)");
  }

  async function handlePrice() {
    try {
      if (paypalEmail && price) {
        console.log(paypalEmail);
        console.log(price);
        setIsSaved(true);
        setTimeout(() => {
          setIsSaved(false);
        }, 1800);
        const res = await axiosInstance.post("/sell", {
          path,
          paypalEmail,
          price,
        });
      }
    } catch {}
  }

  function handleAdd() {
    hiddenFileInput.current.click();
  }
  const [circleWidth, setCircleWidth] = useState(`${window.innerWidth / 5}px`);
  const [listWidth, setListWidth] = useState(`${window.innerWidth / 4}px`);
  useEffect(() => {
    function handleResize() {
      const circleSize = Math.min(window.innerWidth / 5, 150);
      const listSize = Math.min(window.innerWidth / 4, 200);
      setCircleWidth(`${circleSize}px`);
      setListWidth(`${listSize}px`);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const DropArea = ({ area, f }) => {
    const [{ canDrop, isOver, item }, drop] = useDrop({
      accept: "rectangle",
      drop: async (item) => {
        console.log(item.id);
        console.log(f[item.index]);
        if (area === 1) {
          console.log(f);
          audioElement1.src = URL.createObjectURL(f[item.index]);
          //audioElement1.currentTime = 50;
          audioElement1.volume = 0.000001;
          localStream = audioElement1.captureStream();
          setIndex1(item.id);
          setLocalStream1(localStream);

          if (k === 0) {
            audioElement1.play();
          }
          console.log("Stream 1");
          console.log(localStream);
        } else if (area === 2) {
          audioElement2.src = URL.createObjectURL(f[item.index]);
          //audioElement2.currentTime = 50;
          audioElement2.volume = 0.000001;
          localStream = audioElement2.captureStream();
          setIndex2(item.id);
          setLocalStream2(localStream);
          if (k === 0) audioElement2.play();
          console.log("Stream 2");
          console.log(localStream);
        }

        return { name: "DropArea" };
      },
      collect: (monitor) => ({
        canDrop: monitor.canDrop(),
        isOver: monitor.isOver(),
        item: monitor.getItem(),
      }),
    });
    return (
      <div
        ref={drop}
        style={{
          width: circleWidth,
          height: circleWidth,
          background: "black",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
        }}
      >
        {area === 1 ? index1 : area === 2 ? index2 : null}
      </div>
    );
  };
  return (
    <div className="containerStat">
      <Visitors live={users.length} total={total} />
      <b className="nameSt">~{path}~</b>
      <div className="on-air" onClick={handleStart}>
        ON AIR
      </div>
      <DndProvider backend={HTML5Backend}>
        <div
          className="areas"
          style={{
            display: "flex",
            alignItems: "center",
            height: 240,
          }}
        >
          <DropArea area={1} f={files} className="area1" />
          <div
            style={{
              height: "90%",
              width: listWidth,
            }}
          >
            <ClickButton
              control={control}
              music={music}
              handleControl={handleControl}
              handleMusic={handleMusic}
            />
            {music !== "none" ? (
              <div className="list">
                {uploads.map((upload, index) => {
                  return (
                    <div key={index} className="list-inside">
                      <Melody
                        style={{
                          width: 100,
                        }}
                        id={upload}
                        index={index}
                        className="list-item"
                      />
                      <IconButton
                        className="ico-del"
                        onClick={() => handleDeleteSong(index)}
                        aria-label="delete"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </div>
                  );
                })}
                <div>
                  <div
                    style={{
                      textDecoration: "underline",
                      cursor: "pointer",
                      fontSize: 20,
                    }}
                    onClick={handleAdd}
                  >
                    ⊕Add more
                  </div>
                  <input
                    hidden
                    ref={hiddenFileInput}
                    webkitdirectory="true"
                    accept="mp3"
                    multiple
                    type="file"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  height: "90%",
                }}
              >
                <PauseBTN paused={paused1} setPaused={setPaused1} />
                <SliderVol vol={vol1} setVol={setVol1} />
                <SliderVol vol={vol2} setVol={setVol2} />
                <PauseBTN paused={paused2} setPaused={setPaused2} />
              </div>
            )}
          </div>
          <DropArea area={2} f={files} className="area2" />
        </div>
      </DndProvider>
      <div className="buttons_admin">
        <Equalizer room={path} nr={1} />
        <Button
          variant="contained"
          component="label"
          style={{ backgroundColor: "red" }}
          onClick={handleOpen}
        >
          Sell
        </Button>
        <Equalizer room={path} nr={2} />
        <Modal
          className="modal"
          open={open}
          onClose={handleClose}
          closeAfterTransition
        >
          <Box
            className="modal-box"
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 300,
              height: 250,
              padding: 3,
              borderRadius: 8,
              backgroundColor: "black",
              border: "2px solid #000",
              color: "white",
              boxShadow: 24,
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <Typography className="modal-t1" variant="h6" component="h2">
              MAKE MONEY
            </Typography>
            <WhiteCssTextField
              onChange={(e) => {
                setPayPalEmail(e.target.value);
              }}
              style={{ margin: "10px" }}
              InputLabelProps={{
                style: { color: "#fff" },
              }}
              label="PayPal Email"
              type="email"
              value={paypalEmail}
            ></WhiteCssTextField>
            <WhiteCssTextField
              onChange={(e) => {
                e.preventDefault();
                setPrice(e.target.value);
              }}
              style={{ margin: "10px", width: "90px", appearance: "none" }}
              InputLabelProps={{
                style: { color: "#fff", appearance: "none" },
              }}
              label="Price"
              type="number"
              InputProps={{
                endAdornment: "$",
              }}
              value={price}
            ></WhiteCssTextField>
            <Button
              onClick={handlePrice}
              style={{ margin: "10px", height: "60px", width: "90px" }}
              variant="outlined"
            >
              Save
            </Button>

            {isSaved && <Alert severity="success">Saved</Alert>}
          </Box>
        </Modal>
      </div>
    </div>
  );
}

export default Admin;
