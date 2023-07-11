import { IconButton } from "@mui/material";
import PlayArrowRounded from "@mui/icons-material/PlayArrowRounded";
import PauseRounded from "@mui/icons-material/PauseRounded";
import "./PauseBTN.css";
import React from "react";

function PauseBTN({ paused, setPaused }) {
  return (
    <IconButton
      aria-label={paused ? "play" : "pause"}
      onClick={() => setPaused(!paused)}
    >
      {paused ? (
        <PlayArrowRounded sx={{ fontSize: "3rem" }} htmlColor={"#000"} />
      ) : (
        <PauseRounded sx={{ fontSize: "3rem" }} htmlColor={"#000"} />
      )}
    </IconButton>
  );
}

export default PauseBTN;

export const SliderVol = ({ vol, setVol }) => {
  const handleVolume = (event) => {
    console.log(parseFloat(event.target.value));
    setVol(parseFloat(event.target.value));
  };
  return (
    <div
      style={{
        width: 500,
        height: 20,
        position: "relative",
      }}
    >
      <div
        style={{
          width: "400%",
          height: "100%",
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%) rotate(270deg)",
        }}
      >
        <input
          style={{
            width: "100%",
            height: "100%",
            background: "rgb(50,50,50)",
          }}
          type="range"
          min="0"
          max="3"
          step="0.05"
          value={vol}
          onChange={handleVolume}
          className="slider"
        />
      </div>
    </div>
  );
};
