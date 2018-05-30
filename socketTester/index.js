var express = require('express')
var url = require('url');
const WebSocket = require('ws');
var app = express()

const wss = new WebSocket.Server({ port: 8080});

wss.on('connection', function connection(ws) {
	setInterval(function() {
		ws.send("Hey");
	}, 3000);
});


app.listen(3001, function () {
  console.log('Testing sockets')
})
