import React, { useEffect, useState } from "react";
import axiosInstance from "../../Login/Axios";
import { useHistory } from "react-router-dom";
import { Box, Button, Container, TextField } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
const theme = createTheme({
  palette: {
    primary: {
      main: "rgb(255, 185, 0)",
    },
  },
});
function StripeBegin() {
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();
  const [formData, setFormData] = useState({
    email: "",
    first_name: "",
    last_name: "",
  });
  useEffect(() => {
    handleRefresh();
  }, []);
  async function handleRefresh() {
    try {
      const token = localStorage.getItem("token");
      const res = await axiosInstance.get("/stripe_status", {
        params: {
          token: token,
          cases: 1,
        },
      });
      if (res.data.stat) {
        history.push(`/admin/${res.data.path}`, { account: res.data });
      }
    } catch (e) {
      console.log(e);
    }
  }
  async function handleBegin() {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const res = await axiosInstance.post("/stripe_create", {
        token: token,
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: phone,
      });
      if (res.data) {
        setIsLoading(false);
      }
      console.log(res.data);
      if (res.status === 200) {
        history.push("/admin/final", { account: res.data });
      }
    } catch {}
  }
  return (
    <div>
      <div style={{ fontSize: 30 }}>Get ready to get paid</div>
      <ThemeProvider theme={theme}>
        <Box
          component="form"
          noValidate
          sx={{
            mt: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {[
            {
              label: "Email Address",
              name: "email",
              autoComplete: "email",
              autoFocus: true,
            },
            { label: "First Name", name: "first_name", autoComplete: "first" },
            { label: "Last Name", name: "last_name", autoComplete: "last" },
          ].map((field) => (
            <TextField
              key={field.name}
              margin="normal"
              required
              fullWidth
              InputProps={{
                style: { color: "black" },
              }}
              label={field.label}
              name={field.name}
              autoComplete={field.autoComplete}
              autoFocus={field.autoFocus}
              value={formData[field.name]}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  [e.target.name]: e.target.value,
                });
              }}
            />
          ))}
          <TextField
            margin="normal"
            type="tel"
            required
            fullWidth
            InputProps={{
              style: { color: "black" },
              startAdornment: "+40",
            }}
            value={phone}
            label="Phone"
            name="phone"
            autoComplete="phone"
            autoFocus
            onChange={(e) => {
              const numericValue = e.target.value.replace(/\D/g, "");

              let formattedValue = "";
              for (let i = 0; i < numericValue.length; i += 3) {
                formattedValue += numericValue.slice(i, i + 3) + " ";
              }

              const trimmedValue = " " + formattedValue.trim().slice(0, 11);
              setPhone(trimmedValue);
            }}
          />
          <Button
            variant="contained"
            style={{
              background: "rgb(255,185,0)",
              color: "black",
              paddingInline: 100,
              top: 10,
            }}
            onClick={handleBegin}
          >
            <div>Save Individual Details</div>
          </Button>
        </Box>
      </ThemeProvider>

      <p>By click you accept TOS Stripe and us</p>
      {isLoading ? (
        <>
          <p>Loading...</p>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}

export default StripeBegin;
