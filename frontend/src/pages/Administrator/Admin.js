import { Alert, Box, Button, IconButton, Modal } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import Typography from "@mui/material/Typography";
import DeleteIcon from "@mui/icons-material/Delete";
import Peer from "peerjs";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { socket } from "../../App";
import axiosInstance from "../Login/Axios";
import "./Admin.css";
import { createCssTextField } from "../MarketPlace/MarketPlace";
const WhiteCssTextField = createCssTextField("white");
function Admin() {
  let localPeerId;
  let [peer, setPeer] = useState(null);
  const [audioElement] = useState(new Audio());
  let [localStream, setLocalStream] = useState();
  const [paypalEmail, setPayPalEmail] = useState("");
  let [files, setFiles] = useState();
  let [uploads, setUploads] = useState([]);
  let [users, setUsers] = useState([]);
  let [index, setIndex] = useState(0);
  let [indexLength, setIndexLength] = useState(0);
  let [active, setActive] = useState(true);
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
      const r = await axiosInstance.get("/sell", {
        params: {
          station: path,
        },
      });
      setPayPalEmail(r.data.paypalEmail);
      setPrice(r.data.price);
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
  const [open, setOpen] = useState(false);
  const [price, setPrice] = useState("");
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
  };
  const [isSaved, setIsSaved] = useState(false);
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
  return (
    <div className="containerStat">
      <b className="nameSt">~{path}~</b>
      <div className="on-air" onClick={handleStart}>
        ON AIR
      </div>
      <div className="list">
        {uploads.map((upload, index) => {
          if (index % 10 === 0) {
            // Render a new list container after every 10th item
            return (
              <div key={index} className="upload-list">
                <div className="list-inside">
                  <div className="list-item">{upload}</div>
                  <IconButton
                    className="ico-del"
                    onClick={() => handleDeleteSong(index)}
                    aria-label="delete"
                  >
                    <DeleteIcon />
                  </IconButton>
                </div>
              </div>
            );
          } else {
            // Render the upload item as usual for non-10th items
            return (
              <div key={index} className="list-inside">
                <div className="list-item">{upload}</div>
                <IconButton
                  className="ico-del"
                  onClick={() => handleDeleteSong(index)}
                  aria-label="delete"
                >
                  <DeleteIcon />
                </IconButton>
              </div>
            );
          }
        })}
      </div>
      <div className="buttons_admin">
        <div>
          <Button
            variant="contained"
            component="label"
            style={{ backgroundColor: "black" }}
          >
            Upload
            <input
              hidden
              webkitdirectory="true"
              accept="mp3"
              multiple
              type="file"
              onChange={handleFileChange}
            />
          </Button>
          <Button
            variant="contained"
            component="label"
            style={{ backgroundColor: "black" }}
            onClick={handleDeposit}
          >
            Deposit
          </Button>
        </div>
        <Button
          variant="contained"
          component="label"
          style={{ backgroundColor: "black" }}
          onClick={handleLogout}
        >
          Log Out
        </Button>
        <Button
          variant="contained"
          component="label"
          style={{ backgroundColor: "red" }}
          onClick={handleOpen}
        >
          Sell
        </Button>
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
