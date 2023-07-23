import React, { useEffect, useRef, useState } from "react";
import { useDrag } from "react-dnd";
import { socket } from "../../App";

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
        cursor: "pointer",
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
  const [eqWidth, setEqWidth] = useState(`${window.innerWidth}px`);

  useEffect(() => {
    socket.emit("getLow" + nr, lowFreq);
    socket.emit("getMid" + nr, midFreq);
    socket.emit("getHigh" + nr, highFreq);
  }, []);

  useEffect(() => {
    function handleResize() {
      const eqSize = Math.min(window.innerWidth / 15, 70);
      console.log(eqSize);
      setEqWidth(eqSize);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleLowFreqChange = (event) => {
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

  return (
    <div
      style={{
        display: "flex",
      }}
    >
      {[
        {
          label: "LOW",
          value: lowFreq,
          onChange: handleLowFreqChange,
        },
        {
          label: "MID",
          value: midFreq,
          onChange: handleMidFreqChange,
        },
        {
          label: "HIGH",
          value: highFreq,
          onChange: handleHighFreqChange,
        },
      ].map((inputProps, index) => (
        <div key={index}>
          <div
            style={{
              width: `${eqWidth}px`,
              height: `${eqWidth / 2}px`,
              position: "relative",
            }}
          >
            <div
              style={{
                width: "250%",
                height: "100%",
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%) rotate(270deg)",
              }}
            >
              <input
                className="slidereq"
                style={{
                  width: "100%",
                  height: "100%",
                  background: "rgb(50,50,50)",
                }}
                key={index}
                type="range"
                min="-15"
                max="15"
                step="0.1"
                value={inputProps.value}
                onChange={inputProps.onChange}
              />
            </div>
          </div>
          <label
            style={{
              position: "absolute",
              transform: "translate(-50%, 400%)",
              color: "rgb(180,180,180)",
            }}
          >
            {inputProps.label}
          </label>
        </div>
      ))}
    </div>
  );
};

export default Equalizer;
