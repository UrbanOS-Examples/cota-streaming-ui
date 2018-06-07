import React from 'react'
import lodash from 'lodash'
import { Socket } from 'phoenix'

export default function withStream (WrappedComponent, websocketURL) {
  return class extends React.Component {
    constructor (props) {
      super(props)
      this.websocketURL = websocketURL
      this.state = {streamData: []}
    }

    componentDidMount () {
      this.socket = new Socket(this.websocketURL)
      this.socket.connect()

      // vehicle_position is the topic that is subscribed to
      this.channel = this.socket.channel('vehicle_position')
      // The update event is the event on the message that Phoenix sends
      this.channel.on('update', msg => this.onMessageArrived(msg))

      this.channel.join()
        .receive('ok', () => console.log('Connection Successful'))
        .receive('error', ({reason}) => console.log('failed join', reason))
        .receive('timeout', () => console.log('Networking issue. Still waiting...'))
    }

    onSocketOpen (websocket) {
      websocket.send('{"topic":"vehicle_position","event":"phx_join","payload":{},"ref":"1"}')
    }

    onMessageArrived (message) {
      let clonedStreamData = this.state.streamData.slice(0)

      clonedStreamData.unshift(this.parseCOTAJSON(message))

      this.setState({ streamData: lodash.take(clonedStreamData, 100) })
    }

    parseCOTAJSON (json) {
      const vehicleData = json.vehicle
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
