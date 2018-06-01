var express = require('express')
var url = require('url')
const WebSocket = require('ws')
var app = express()

const wss = new WebSocket.Server({ port: 8080})

someJson = {
 "topic":"vehicle_position",
    "ref":null,
    "payload":{
      "data":`{
        \"vehicle\":{
          \"vehicle\":{
            \"license_plate\":null,
            \"label\":\"2924\",
            \"id\":\"12924\"
          },
          \"trip\":{
            \"trip_id\":\"630125\",
            \"start_time\":null,
            \"start_date\":\"20180601\",
            \"schedule_relationship\":null,
            \"route_id\":\"007\",
            \"direction_id\":null},
            \"timestamp\":1527877744,
            \"stop_id\":null,
            \"position\":{
              \"speed\":6.041108917997917e-6,
              \"odometer\":null,
              \"longitude\":-82.91253662109375,
              \"latitude\":39.98493957519531,
              \"bearing\":null
            },
            \"occupancy_status\":null,
            \"current_stop_sequence\":null,
            \"current_status\":\"IN_TRANSIT_TO\",
            \"congestion_level\":null},
            \"trip_update\":null,
            \"is_deleted\":false,
            \"id\":\"2924\",
            \"alert\":null
          }`
      },
      "event":"update"
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
}, 1000)

app.listen(3001, function () {
  console.log('Testing sockets')
})
