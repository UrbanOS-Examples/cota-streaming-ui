var express = require('express')
var url = require('url');
const WebSocket = require('ws');
var app = express()

const wss = new WebSocket.Server({ port: 8080});

wss.on('connection', function connection(ws) {});


wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};
setInterval(function() {
  wss.broadcast("Hey");
}, 3000);

app.listen(3001, function () {
  console.log('Testing sockets')
})
