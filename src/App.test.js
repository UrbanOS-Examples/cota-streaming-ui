import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { shallow, mount } from 'enzyme'
import { WebSocket, Server } from 'mock-socket'

global.WebSocket = WebSocket

let subject, testJSON, expectedOutput

testJSON = `
  {
    "vehicle": {
      "vehicle": {
        "license_plate": null,
        "label": "2939",
        "id": "12939"
      },
      "trip": {
        "trip_id": "637274",
        "start_time": null,
        "start_date": "20180531",
        "schedule_relationship": null,
        "route_id": "152",
        "direction_id": null
      },
      "timestamp": 1527795212,
      "stop_id": null,
      "position": {
        "speed": 8.6301554347301e-7,
        "odometer": null,
        "longitude": -82.885498046875,
        "latitude": 39.998947143555,
        "bearing": 270
      },
      "occupancy_status": null,
      "current_stop_sequence": null,
      "current_status": "IN_TRANSIT_TO",
      "congestion_level": null
    },
    "trip_update": null,
    "is_deleted": false,
    "id": "2939",
    "alert": null
  }
`

expectedOutput = {
  "vehicleID": "12939",
  "routeID": "152",
  "latitude": 39.998947143555,
  "longitude": -82.885498046875,
  "timestamp": 1527795212
} 

describe('basic app', () => {

  it('renders without crashing', () => {
    subject= shallow(<App />)
    expect(subject.find('.App-header')).toHaveLength(1)
  })
})

describe('json parsing', () => {

  it('outputs the right object for a given JSON', () => {
    subject= shallow(<App />)
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
 
    subject= mount(<App />)
    subject.setState({tableData: ["some fake data"]})
    setTimeout(() => {
      expect(subject.find('td').first().text()).toEqual(expectedOutput.vehicleID)
      mockServer.stop(done)
    }, 100)
  })
})
