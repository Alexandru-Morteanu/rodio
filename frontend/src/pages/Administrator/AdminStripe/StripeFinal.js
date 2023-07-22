import React, { useEffect, useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Button, TextField } from "@mui/material";
import axiosInstance from "../../Login/Axios";
import {
  useHistory,
  useLocation,
} from "react-router-dom/cjs/react-router-dom.min";
const theme = createTheme({
  palette: {
    primary: {
      main: "rgb(255, 185, 0)",
    },
  },
});
function StripeFinal() {
  const [isLoading, setIsLoading] = useState(false);
  const [day, setDay] = useState(1);
  const [month, setMonth] = useState(1);
  const [year, setYear] = useState(2000);
  const location = useLocation();
  const history = useHistory();
  const { account } = location.state ? location.state : "";
  console.log("Received Account Data:", account);
  const [formData, setFormData] = useState({
    city: "",
    line1: "",
    zip: "",
    iban: "",
  });
  useEffect(() => {
    // if (!location.state) {
    //   history.push("/admin/stripe");
    // }
    handleRefresh();
    console.log(account);
  }, []);
  async function handleRefresh() {
    try {
      const token = localStorage.getItem("token");
      const res = await axiosInstance.get("/stripe_status", {
        params: {
          token: token,
          cases: 2,
        },
      });
      console.log(res.data);
      if (res.data) {
        history.push("/admin/completed");
      }
    } catch (e) {
      console.log(e);
    }
  }
  const handleDateChange = (date) => {
    setDay(parseInt(dayjs(date).format("DD")));
    setMonth(parseInt(dayjs(date).format("MM")));
    setYear(parseInt(dayjs(date).format("YYYY")));
    console.log(day);
    console.log(month);
    console.log(year);
  };
  async function handleFinal() {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const res = await axiosInstance.post("/stripe_final", {
        token: token,
        city: formData.city,
        line1: formData.city,
        postal_code: formData.zip,
        iban: formData.iban,
        day: day,
        month: month,
        year: year,
        account: account,
      });
      if (res.data) {
        setIsLoading(false);
      }
      handleRefresh();
    } catch {}
  }

  return (
    <div>
      <div style={{ fontSize: 30, padding: 10 }}>One More Step</div>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker format="DD/MM/YYYY" onChange={handleDateChange} />
        </LocalizationProvider>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          {[
            {
              label: "City",
              name: "city",
              autoComplete: "city",
              autoFocus: true,
            },
            { label: "Adress line", name: "line1", autoComplete: "line1" },
            { label: "Zip code", name: "zip", autoComplete: "zip" },
            { label: "Iban", name: "iban", autoComplete: "iban" },
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
        </div>
        <Button
          variant="contained"
          style={{
            background: "rgb(255,185,0)",
            color: "black",
            paddingInline: 150,
            top: 10,
          }}
        >
          <div onClick={handleFinal}>Finito</div>
        </Button>
      </ThemeProvider>
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

export default StripeFinal;
