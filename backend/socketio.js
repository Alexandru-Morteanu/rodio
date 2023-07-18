const express = require("express");
const cors = require("cors");
const app = express();
const https = require("https");

const certificateText = process.env.CERTIFICATE;
const privateKeyText = process.env.PRIVATE_KEY;

const server = https.createServer(
  {
    key: privateKeyText,
    cert: certificateText,
  },
  app
);
console.log(server);
const io = require("socket.io")(server);

app.use(cors());

const port = 8080;

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

io.on("connection", (socket) => {
  console.log("New client connected");
  io.emit("open");

  socket.on("joinRoom", (room, localPeerId) => {
    socket.data.localPeerId = localPeerId;
    socket.join(room);
    console.log(`----->Client joined room ${room}`);
    const getRoom = io.sockets.adapter.rooms.get(room);
    let socketa = [];
    for (const socketId of getRoom) {
      socketa.push(io.sockets.sockets.get(socketId).data.localPeerId);
    }
    io.to(room).emit("peerId", socketa);
  });

  socket.on("sendMessageToRoom", (room, message) => {
    io.to(room).emit("newMessage", message);
    console.log(`Sent new message to room ${room}: ${message}`);
  });

  const events = {
    getLow1: "low1",
    getMid1: "mid1",
    getHigh1: "high1",
    getLow2: "low2",
    getMid2: "mid2",
    getHigh2: "high2",
    getGain: "gain",
    getVol1: "vol1",
    getVol2: "vol2",
  };

  Object.entries(events).forEach(([eventName, emitName]) => {
    socket.on(eventName, (data, room) => {
      io.to(room).emit(emitName, data);
    });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});
