import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import axiosInstance from "./Axios";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
const theme = createTheme({
  palette: {
    primary: {
      main: "rgb(255, 185, 0)",
    },
  },
});
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();
  async function handleSubmit(e) {
    e.preventDefault();

    try {
      console.log(email);
      console.log(password);
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
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography component="h1" variant="h5" color="rgb(30, 30, 30)">
              Sign In
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                InputProps={{
                  style: { color: "black" },
                }}
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                InputProps={{
                  style: { color: "black" },
                }}
                autoComplete="current-password"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link
                    to="/login"
                    href="#"
                    variant="body2"
                    style={{ color: "black", marginRight: "30px" }}
                  >
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link to="/signup" style={{ color: "black" }}>
                    Don't have an account? Sign Up
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </div>
  );
}

export default Login;
