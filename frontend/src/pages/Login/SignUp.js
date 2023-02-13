import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import axiosInstance from "./Axios";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const history = useHistory();

  async function handleSubmit(e) {
    e.preventDefault();
    if (password !== confirmPassword && password !== "") {
      console.log("Passwords do not match");
    } else {
      try {
        const res = await axiosInstance.post("/signup", {
          email,
          password,
        });
        if (res.status === 400) {
          console.log("User already exists");
        } else {
          console.log(res.data.token);
          localStorage.setItem("token", res.data.token);
          history.push("/market", { state: { token: res.data.token } });
        }
      } catch (e) {
        console.log("wrong details");
        console.log(e);
      }
    }
  }
  return (
    <div>
      SignUp
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          placeholder="Email"
          name=""
          id=""
        />
        <input
          type="password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          placeholder="Password"
          name=""
          id=""
        />
        <input
          type="password"
          onChange={(e) => {
            setConfirmPassword(e.target.value);
          }}
          placeholder="ConfirmPassword"
          name=""
          id=""
        />
        <input type="submit" value="log" />
      </form>
    </div>
  );
}

export default Login;
