import React, { Component } from 'react'
import './App.css'
import DataTable from './components/data-table.js'

const joinChannelString = '{"topic":"vehicle_position","event":"phx_join","payload":{},"ref":"1"}'
const websocketURL = 'ws://localhost:8080'

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {tableData: []}
  }

  parseCOTAJSON (json) {
    var parsedData = JSON.parse(json.payload.data).vehicle
    return {
    'vehicleID': parsedData.vehicle.id,
    'routeID': parsedData.trip.route_id,
    'latitude': parsedData.position.latitude,
    'longitude': parsedData.position.longitude,
    'timestamp': parsedData.timestamp
    }
  }
  componentDidMount () {
    var websocket = new WebSocket(websocketURL)
    websocket.addEventListener('open', function open () {
      websocket.send(joinChannelString)
    })

    websocket.addEventListener('message', data => {
      let parsedData = JSON.parse(data.data)
      if (parsedData.event === 'update') {
        this.state.tableData.unshift(this.parseCOTAJSON(parsedData))
        if(this.state.tableData.length > 100) {
          this.state.tableData.splice(-1, this.state.tableData.length - 100)    
        }
      }
      this.setState({tableData: this.state.tableData})
    })
  }

  render () {
    return (
      <div className='App'>
        <header className='App-header'>
          <img src='https://www.cota.com/wp-content/uploads/2016/04/COTA-Logo-White.png' className='App-logo' alt='logo' />
          <h1 className='App-title'>Actual Real-Time COTA Data</h1>
        </header>
        <DataTable tableData={this.state.tableData} />
      </div>
    )
  }
}

export default App