const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const cors = require("cors");
const io = require("socket.io")(server, {
  cors: { origin: "*" },
});
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

  socket.on("getLow", (low, room) => {
    io.to(room).emit("low", low);
  });
  socket.on("getMid", (mid, room) => {
    io.to(room).emit("mid", mid);
  });
  socket.on("getHigh", (high, room) => {
    io.to(room).emit("high", high);
  });
  socket.on("getGain", (gain, room) => {
    io.to(room).emit("gain", gain);
  });
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});
/*
 */
