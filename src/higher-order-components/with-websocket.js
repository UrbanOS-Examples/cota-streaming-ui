import React from 'react'
import lodash from 'lodash'

export default function withStream (WrappedComponent, websocketURL) {
  return class extends React.Component {
    constructor (props) {
      super(props)
      this.websocketURL = websocketURL
      this.state = {streamData: []}
    }

    componentDidMount () {
      var websocket = new WebSocket(this.websocketURL)

      websocket.addEventListener('open', () => this.onSocketOpen(websocket))

      websocket.addEventListener('message', message => this.onMessageArrived(message))
    }

    onSocketOpen (websocket) {
      websocket.send('{"topic":"vehicle_position","event":"phx_join","payload":{},"ref":"1"}')
    }

    onMessageArrived (message) {
      var parsedJSON = JSON.parse(message.data)

      if (parsedJSON.event === 'update') {
        let clonedStreamData = this.state.streamData.slice(0)

        clonedStreamData.unshift(this.parseCOTAJSON(parsedJSON))

        this.setState({ streamData: lodash.take(clonedStreamData, 100) })
      }
    }

    parseCOTAJSON (json) {
      const vehicleData = json.payload.vehicle
      return {
        'vehicleID': vehicleData.vehicle.id,
        'routeID': vehicleData.trip.route_id,
        'latitude': vehicleData.position.latitude,
        'longitude': vehicleData.position.longitude,
        'timestamp': vehicleData.timestamp * 1000
      }
    }

    render () {
      return <WrappedComponent data={this.state.streamData} {...this.props} />
    }
  }
}
