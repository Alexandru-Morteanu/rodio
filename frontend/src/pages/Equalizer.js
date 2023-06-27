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

export const Equalizer = ({ room, nr }) => {
  const [lowFreq, setLowFreq] = useState(0);
  const [midFreq, setMidFreq] = useState(0);
  const [highFreq, setHighFreq] = useState(0);
  const [gain, setGain] = useState(-3);

  useEffect(() => {
    socket.emit("getLow" + nr, lowFreq);
    socket.emit("getMid" + nr, midFreq);
    socket.emit("getHigh" + nr, highFreq);
    socket.emit("getGain" + nr, gain);
  }, []);
  const handleLowFreqChange = (event) => {
    console.log(parseFloat(event.target.value));
    socket.emit("getLow" + nr, parseFloat(event.target.value), room);
    setLowFreq(parseInt(event.target.value));
  };

  const handleMidFreqChange = (event) => {
    socket.emit("getMid" + nr, parseFloat(event.target.value), room);
    setMidFreq(parseInt(event.target.value));
  };

  const handleHighFreqChange = (event) => {
    socket.emit("getHigh" + nr, parseFloat(event.target.value), room);
    setHighFreq(parseInt(event.target.value));
  };

  const handleGainChange = (event) => {
    socket.emit("getGain" + nr, parseInt(event.target.value), room);
    setGain(parseInt(event.target.value));
  };

  return (
    <div>
      {[
        {
          label: "Low Frequency",
          value: lowFreq,
          onChange: handleLowFreqChange,
        },
        {
          label: "Mid Frequency",
          value: midFreq,
          onChange: handleMidFreqChange,
        },
        {
          label: "High Frequency",
          value: highFreq,
          onChange: handleHighFreqChange,
        },
      ].map((inputProps, index) => (
        <div>
          <label>{inputProps.label}</label>
          <input
            key={index}
            type="range"
            min="-15"
            max="15"
            step="0.1"
            value={inputProps.value}
            onChange={inputProps.onChange}
          />
        </div>
      ))}

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
