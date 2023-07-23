import React from "react";
import "../Homepage.css";
import AdSense from "react-adsense";
import { Link } from "react-router-dom";
import FastRewindRounded from "@mui/icons-material/FastRewindRounded";
import FastForwardRounded from "@mui/icons-material/FastForwardRounded";
import { Box, IconButton, Tooltip } from "@mui/material";
import PauseBTN from "../LessCode/PauseBTN";
import styled from "@emotion/styled";
import { red } from "@mui/material/colors";
const Widget = styled("div")(({ theme }) => ({
  padding: 16,
  borderRadius: 16,
  width: 200,
  maxWidth: "20%",
  margin: "auto",
  position: "relative",
  zIndex: 1,
  backgroundColor: red,
  backdropFilter: "blur(40px)",
}));
function Homepage_base({
  handleGet,
  items,
  prevPath,
  paused,
  setPaused,
  nextPath,
  users,
  path,
}) {
  return (
    <>
      <div className="left">
        <div className="label">
          <div className="logo">
            <b>SERPAS</b>
          </div>
          <div onClick={handleGet} className="getStart">
            <Link className="get" to="/signup">
              Get Started
            </Link>
          </div>
        </div>
        <canvas id="visualizer"></canvas>
        <div className="top">TOP</div>
        <div className="liderboard">
          <ul>{items}</ul>
          <ul>{items}</ul>
          <ul>{items}</ul>
        </div>
        <div className="buttons">
          <Box sx={{ width: "100%", overflow: "hidden" }}>
            <Widget>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mt: -1,
                }}
              >
                <IconButton onClick={prevPath} aria-label="previous song">
                  <FastRewindRounded fontSize="large" htmlColor={"#000"} />
                </IconButton>
                <PauseBTN paused={paused} setPaused={setPaused} />
                <IconButton onClick={nextPath} aria-label="next song">
                  <FastForwardRounded fontSize="large" htmlColor={"#000"} />
                </IconButton>
              </Box>
            </Widget>
          </Box>
        </div>
      </div>
      <div className="right">
        <div className="adds">
          <AdSense.Google
            client="ca-pub-7292810486004926"
            slot="7806394673"
            style={{ display: "block" }}
            format="auto"
          />
        </div>
        <Tooltip title={"Listeners: " + users.length} placement="top">
          <div className="currentStation">~{path}~</div>
        </Tooltip>
      </div>
    </>
  );
}

export default Homepage_base;
