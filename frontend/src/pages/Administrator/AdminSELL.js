import React, { useEffect } from "react";
import axiosInstance from "../Login/Axios";
import "./AdminSELL.css";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import Modal from "@mui/material/Modal";
const initialOptions = {
  "client-id":
    "AaRTEhtrTxRD8uZ9LsieYK_o_YmNnGuCLJj7gOWFBDeg9W-SxLXajlZ9YSxjt0estoJUarlgjGFKMcIc",
  currency: "USD",
  intent: "capture",
};
function AdminSELL() {
  return (
    <>
      <PayPalScriptProvider options={initialOptions}>
        <PayPalButtons
          createOrder={(data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: "200",
                  },
                },
              ],
            });
          }}
          style={{ layout: "horizontal" }}
          onApprove={(data, actions) => {
            return actions.order
              .capture()
              .then((details) => {
                const name = details.payer.name.given_name;
                alert(`Transaction completed by ${name}`);
              })
              .catch((error) => {
                console.log(error);
              });
          }}
        />
      </PayPalScriptProvider>
    </>
  );
}
export default AdminSELL;
