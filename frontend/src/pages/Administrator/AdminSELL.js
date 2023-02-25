import React from "react";
import axiosInstance from "../Login/Axios";
import "./AdminSELL.css";

function AdminSELL() {
  const handleSubmit = async (event) => {
    event.preventDefault();
    const res = await axiosInstance.post("/sell");
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Account holder's name
        <input type="text" name="account_holder_name" />
      </label>
      <label>
        Account number
        <input type="text" name="account_number" />
      </label>
      <label>
        Routing number
        <input type="text" name="routing_number" />
      </label>
      <label>
        Address
        <input type="text" name="address" />
      </label>
      <label>Bank account details</label>
      <button type="submit">Submit</button>
    </form>
  );
}

export default AdminSELL;
