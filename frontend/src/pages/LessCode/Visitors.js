import React from "react";
function Visitors({ live, total }) {
  return (
    <div
      style={{
        width: "80%",
        height: "25%",
        position: "absolute",
        transform: "translate(-50% -50%)",
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      <div
        style={{
          width: "20%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
        }}
      >
        {[
          {
            label: "LIVE",
            color: "red",
            value: live,
          },
          {
            label: "TOTAL",
            color: "black",
            value: total,
          },
        ].map((inputProps, index) => (
          <div
            key={index}
            style={{
              width: "100%",
              height: "30%",
              border: "solid",
              color: inputProps.color,
            }}
          >
            {inputProps.label}
            <br />
            {inputProps.value}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Visitors;
