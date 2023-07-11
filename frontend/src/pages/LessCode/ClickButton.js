import React from "react";

const style = {
  height: 30,
  width: "40%",
  borderRadius: 12,
  border: "solid",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  transition: "0.2s",
};
function ClickButton({ control, music, handleControl, handleMusic }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: 5,
      }}
    >
      <div
        className="adminSwitch1"
        style={{ ...style, background: music }}
        onClick={handleMusic}
      >
        Music
      </div>
      <div
        className="adminSwitch2"
        style={{ ...style, background: control }}
        onClick={handleControl}
      >
        Control
      </div>
    </div>
  );
}

export default ClickButton;
