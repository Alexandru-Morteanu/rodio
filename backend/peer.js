const { PeerServer } = require("peer");

const peerServer = PeerServer({
  port: 5050,
  path: "/",
});

peerServer.on("connection", (client) => {
  console.log("New client connected:", client.id);
});

peerServer.on("disconnect", (client) => {
  console.log("Client disconnected:", client.id);
});
