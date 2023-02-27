import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { useHistory } from "react-router-dom";
import axiosInstance from "../Login/Axios";
import "./MarketPlace.css";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

export const createCssTextField = (color) =>
  styled(TextField)({
    "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
      display: "none",
    },
    "& input[type=number]": {
      MozAppearance: "textfield",
    },
    "& label.Mui-focused": {
      color: color,
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: color,
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: color,
      },
      "&:hover fieldset": {
        borderColor: color,
      },
      "&.Mui-focused fieldset": {
        borderColor: color,
      },
      color: color,
      "& .MuiInputLabel-root": {
        color: "red",
      },
    },
  });

const BlackCssTextField = createCssTextField("black");

function MarketPlace() {
  const [stationName, setStationName] = useState("");
  let [stations, setStations] = useState([]);
  let [yellow, setYellow] = useState("");
  let [price, setPrice] = useState("");
  let history = useHistory();
  const initialOptions = {
    "client-id":
      "AaRTEhtrTxRD8uZ9LsieYK_o_YmNnGuCLJj7gOWFBDeg9W-SxLXajlZ9YSxjt0estoJUarlgjGFKMcIc",
    currency: "USD",
    intent: "capture",
  };
  async function handleCreateStation(e) {
    e.preventDefault();
    try {
      const res = await axiosInstance.post("/market/add", {
        stationName,
      });
      handleRefresh();
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    handleRefresh();
  }, []);
  async function handleGiveStation(station) {
    try {
      const token = localStorage.getItem("token");
      const res = await axiosInstance.post("/market/status", {
        station,
        token,
      });
      if (res.status === 200) {
        history.push("/admin");
      } else if (res.status === 201) {
        console.log("yellow");
        setYellow(station);
        setPrice(res.data);
        console.log(res.data);
        handleOpen();
      } else {
        console.log("red");
      }
    } catch (error) {
      alert("wrong");
      console.log(error);
    }
  }
  async function handleRefresh() {
    try {
      const res = await axiosInstance.get("/market/add");
      setStations(res.data);
    } catch (error) {
      alert("wrong details");
      console.log(error);
    }
  }
  const containerCardsRef = useRef("");
  const observer = new ResizeObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.contentRect.height >= 380) {
        if (containerCardsRef.current)
          containerCardsRef.current.classList.add("scrollable");
      } else {
        if (containerCardsRef.current)
          containerCardsRef.current.classList.remove("scrollable");
      }
    });
  });
  useEffect(() => {
    observer.observe(containerCardsRef.current);
  }, [containerCardsRef]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <div className="containerer">
      <b className="name">MarketPlace</b>
      <div className="containerCards" ref={containerCardsRef}>
        {stations.map((station) => (
          <div
            onClick={() => handleGiveStation(station.station)}
            className="stationCard"
            style={{
              background: station.status,
            }}
            key={station.station}
          >
            ~{station.station}~
          </div>
        ))}
      </div>
      <div className="buttons_market">
        <BlackCssTextField
          onChange={(e) => {
            if (e.target.value <= 999) {
              setStationName(e.target.value);
            }
          }}
          label="Station"
          id="custom-css-outlined-input"
          sx={{
            color: "black",
            marginTop: "20px",
            "& label": {
              display: "flex",
              alignItems: "center",
              marginTop: "-0.3rem",
            },
            "& input": {
              height: "10px",
            },
            "& label.Mui-focused": {
              marginTop: "0",
            },
          }}
          value={stationName}
          type="number"
          inputProps={{
            max: 999,
          }}
        />
        <Button
          onClick={handleCreateStation}
          variant="contained"
          sx={{
            marginTop: "20px",
            height: "43px",
            backgroundColor: "black",
            "&:hover": { backgroundColor: "black" },
          }}
        >
          CREATE
        </Button>
      </div>
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
            width: 150,
            height: 100,
            padding: 3,
            borderRadius: 8,
            backgroundColor: "black",
            border: "2px solid #000",
            color: "white",
            boxShadow: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            flexDirection: "column",
          }}
        >
          <b>{price}$</b>
          <PayPalScriptProvider options={initialOptions}>
            <PayPalButtons
              createOrder={(data, actions) => {
                return actions.order.create({
                  purchase_units: [
                    {
                      amount: {
                        value: price,
                      },
                    },
                  ],
                });
              }}
              style={{ layout: "horizontal" }}
              onApprove={(data, actions) => {
                return actions.order
                  .capture()
                  .then(async () => {
                    const token = localStorage.getItem("token");
                    const res = await axiosInstance.post("/sold", {
                      station: yellow,
                      token: token,
                    });
                    history.push("/admin");
                  })
                  .catch((error) => {
                    console.log(error);
                  });
              }}
            />
          </PayPalScriptProvider>
        </Box>
      </Modal>
    </div>
  );
}

export default MarketPlace;
