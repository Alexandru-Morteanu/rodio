import { IconButton } from "@mui/material";
import PlayArrowRounded from "@mui/icons-material/PlayArrowRounded";
import PauseRounded from "@mui/icons-material/PauseRounded";

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
    <input
      style={{ transform: "rotate(270deg)", height: 10 }}
      type="range"
      min="0"
      max="1"
      step="0.05"
      value={vol}
      onChange={handleVolume}
    />
  );
};
