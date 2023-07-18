import React, { useEffect, useState } from "react";
import axiosInstance from "../../Login/Axios";
import { useLocation } from "react-router-dom";

function StripeBegin() {
  const [isLoading, setIsLoading] = useState(false);
  const [setUpBegin, setSetUpBegin] = useState(false);
  const [account_number, setAccountNumber] = useState(0);
  const location = useLocation();
  const path = location.pathname.split("/");
  useEffect(() => {}, []);
  function handleChange(e) {
    setAccountNumber(e.target.value);
  }
  async function handleBegin() {
    try {
      setIsLoading(true);
      const res = await axiosInstance.post("/stripe", {
        account_number: account_number,
      });
      setTimeout(() => {
        if (res.data) {
          setIsLoading(false);
          setSetUpBegin(true);
        }
        console.log(res.data);
      }, 1000);
    } catch {}
  }
  return (
    <div>
      <button onClick={handleBegin}>button</button>
      <input type="number" onChange={handleChange}></input>
      {isLoading ? (
        <>
          <p>Loading...</p>
        </>
      ) : setUpBegin ? (
        <p>WELCOME</p>
      ) : (
        <></>
      )}
      <p>By click you accept TOS Stripe</p>
    </div>
  );
}

export default StripeBegin;
