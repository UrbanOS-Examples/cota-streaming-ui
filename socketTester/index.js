var express = require('express')
var url = require('url')
const WebSocket = require('ws')
var app = express()

const wss = new WebSocket.Server({ port: 8080})

someJson = {
  'vehicle': {
    'vehicle': {
      'license_plate': null,
      'label': '2939',
      'id': '12939'
    },
    'trip': {
      'trip_id': '637274',
      'start_time': null,
      'start_date': '20180531',
      'schedule_relationship': null,
      'route_id': '152',
      'direction_id': null
    },
    'timestamp': 1527795212,
    'stop_id': null,
    'position': {
      'speed': 8.630155434730113e-7,
      'odometer': null,
      'longitude': -82.885498046875,
      'latitude': 39.99894714355469,
      'bearing': 270.0
    },
    'occupancy_status': null,
    'current_stop_sequence': null,
    'current_status': 'IN_TRANSIT_TO',
    'congestion_level': null
  },
  'trip_update': null,
  'is_deleted': false,
  'id': '2939',
  'alert': null
}

wss.on('connection', function connection (ws) {})

wss.broadcast = function broadcast (data) {
  wss.clients.forEach(function each (client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data)
    }
  })
}
setInterval(function () {
  wss.broadcast(JSON.stringify(someJson))
}, 3000)

app.listen(3001, function () {
  console.log('Testing sockets')
})
