import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { shallow, mount } from 'enzyme'
import { WebSocket, Server } from 'mock-socket'

global.WebSocket = WebSocket

let subject, testJSON, expectedOutput

testJSON = 
  {
    "topic":"vehicle_position",
    "ref":null,
    "payload":{
      "vehicle": {
          "vehicle": {
              "license_plate": null,
              "label": "2928",
              "id": "12924"
          },
          "trip": {
              "trip_id": "628650",
              "start_time": null,
              "start_date": "20180601",
              "schedule_relationship": null,
              "route_id": "007",
              "direction_id": null
          },
          "timestamp": 1527877744,
          "stop_id": null,
          "position": {
              "speed": 5.350696483219508e-6,
              "odometer": null,
              "longitude": -82.91253662109375,
              "latitude": 39.98493957519531,
              "bearing": null
          },
          "occupancy_status": null,
          "current_stop_sequence": null,
          "current_status": "IN_TRANSIT_TO",
          "congestion_level": null
        },
        "trip_update": null,
        "is_deleted": false,
        "id": "2928",
        "alert": null
      },
      "event":"update"
    }

expectedOutput = {
  'vehicleID': '12924',
  'routeID': '007',
  'latitude': 39.98493957519531,
  'longitude': -82.91253662109375,
  'timestamp': 1527877744
}

describe('basic app', () => {
  it('renders without crashing', () => {
    subject = shallow(<App />)
    expect(subject.find('.App-header')).toHaveLength(1)
  })
})

describe('json parsing', () => {
  it('outputs the right object for a given JSON', () => {
    subject = shallow(<App />)
    let instance = subject.instance()
    let actual = instance.parseCOTAJSON(testJSON)
    expect(actual).toEqual(expectedOutput)
  })
})

describe('the web socket connection', () => {
  it('processes and displays data from the socket', (done) => {
    const mockServer = new Server('ws://localhost:8080')
    mockServer.on('connection', server => {
      mockServer.send(testJSON)
    })

    subject = mount(<App />)
    subject.setState({tableData: ['some fake data']})
    setTimeout(() => {
      expect(subject.find('td').first().text()).toEqual(expectedOutput.vehicleID)
      mockServer.stop(done)
    }, 100)
  })
})
