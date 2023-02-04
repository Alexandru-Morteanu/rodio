const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 3001 });

server.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('message', (message) => {
    console.log(`Received message: ${message}`);
    socket.send(`Echo: ${message}`);
  });
});