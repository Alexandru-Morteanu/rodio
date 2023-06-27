import React, { useEffect, useRef, useState } from "react";
import { useDrag } from "react-dnd";
import { socket } from "../App";

export const Melody = ({ id, index }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "rectangle",
    item: { id: id, index: index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      style={{
        borderRadius: 30,
        padding: 3,
        width: 130,
      }}
    >
      {id}
    </div>
  );
};

export const Equalizer = ({ room, audioElement1 }) => {
  const [lowFreq, setLowFreq] = useState(0);
  const [midFreq, setMidFreq] = useState(0);
  const [highFreq, setHighFreq] = useState(0);
  const [gain, setGain] = useState(-3);

  useEffect(() => {
    socket.emit("getLow", lowFreq);
    socket.emit("getMid", midFreq);
    socket.emit("getHigh", highFreq);
    socket.emit("getGain", gain);
  }, []);
  const handleLowFreqChange = (event) => {
    console.log(parseFloat(event.target.value));
    socket.emit("getLow", parseFloat(event.target.value), room);
    setLowFreq(parseInt(event.target.value));
  };

  const handleMidFreqChange = (event) => {
    socket.emit("getMid", parseFloat(event.target.value), room);
    setMidFreq(parseInt(event.target.value));
  };

  const handleHighFreqChange = (event) => {
    socket.emit("getHigh", parseFloat(event.target.value), room);
    setHighFreq(parseInt(event.target.value));
  };

  const handleGainChange = (event) => {
    socket.emit("getGain", parseInt(event.target.value), room);
    setGain(parseInt(event.target.value));
  };

  return (
    <div>
      <div>
        <label>Low Frequency</label>
        <input
          type="range"
          min="-15"
          max="15"
          step="0.1"
          value={lowFreq}
          onChange={handleLowFreqChange}
        />
      </div>
      <div>
        <label>Mid Frequency</label>
        <input
          type="range"
          min="-15"
          max="15"
          step="0.1"
          value={midFreq}
          onChange={handleMidFreqChange}
        />
      </div>
      <div>
        <label>High Frequency</label>
        <input
          type="range"
          min="-15"
          max="15"
          step="0.1"
          value={highFreq}
          onChange={handleHighFreqChange}
        />
      </div>
      <div>
        <label>Gain</label>
        <input
          type="range"
          min="-30"
          max="8"
          value={gain}
          onChange={handleGainChange}
        />
      </div>
    </div>
  );
};

export default Equalizer;
