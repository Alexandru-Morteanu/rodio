const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080 });

const clients = new Set();

wss.on("connection", (ws) => {
  clients.add(ws);
  ws.on("message", (mess) => {
    console.log(mess);
    for (let client of clients) {
      client.send(mess.toString());
    }
  });
  ws.onclose = (data) => {
    console.log(data);
  };
});
