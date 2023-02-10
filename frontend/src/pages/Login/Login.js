import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import axiosInstance from "./Axios";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();
  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const res = await axiosInstance.post("/login ", {
        email,
        password,
      });
      if (res.status === 201) {
        localStorage.setItem("token", res.data.token);
        history.push("/admin", { state: { id: email } });
      } else {
        console.log("user not found");
      }
    } catch (error) {
      alert("wrong details");
      console.log(error);
    }
  }
  return (
    <div>
      Login
      <form action="POST" onSubmit={handleSubmit}>
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
        <input type="submit" value="log" />
      </form>
    </div>
  );
}

export default Login;
