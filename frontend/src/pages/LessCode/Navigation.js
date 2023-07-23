import React from "react";
import { useHistory } from "react-router-dom";
function Navigation() {
  const history = useHistory();
  function handleClick(where) {
    console.log(where);
    switch (where) {
      case "home":
        history.push("/");
        break;
      case "market":
        history.push("/market");
        break;
      case "admin":
        history.push("/admin");
        break;
      case "login":
        history.push("/login");
        break;
      case "signup":
        history.push("/signup");
        break;
      default:
        break;
    }
  }
  return (
    <div
      style={{
        display: "flex",
        gap: 40,
        top: 20,
        zIndex: 2,
        cursor: "pointer",
      }}
    >
      <div onClick={() => handleClick("home")}>Home</div>
      <div onClick={() => handleClick("market")}>Market</div>
      <div onClick={() => handleClick("admin")}>Admin</div>
      <div
        onClick={() => handleClick("login")}
        style={{
          color: "rgb(255,185,0)",
        }}
      >
        Login
      </div>
      <div onClick={() => handleClick("signup")}>Signup</div>
    </div>
  );
}

export default Navigation;
