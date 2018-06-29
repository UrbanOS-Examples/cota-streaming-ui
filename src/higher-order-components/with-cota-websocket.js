import React from 'react'
import { Socket } from 'phoenix'

export default function(WrappedComponent, websocketURL) {
  return class extends React.Component {
    constructor (props) {
      super(props)
      this.websocketURL = websocketURL
      this.state = { }
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

    onMessageArrived (message) {
      let msg = this.parseCOTAJSON(message)
      let newState = Object.assign({}, this.state)

      newState[msg.vehicleId] = msg

      this.setState(newState)
    }

    parseCOTAJSON (msg) {
      const vehicleData = msg.vehicle
      return {
        vehicleId: vehicleData.vehicle.id,
        routeId: vehicleData.trip.route_id,
        latitude: vehicleData.position.latitude,
        longitude: vehicleData.position.longitude,
        bearing: vehicleData.position.bearing || 0,
        timestamp: vehicleData.timestamp * 1000
      }
    }

    render () {
      return <WrappedComponent data={Object.values(this.state)} {...this.props} />
    }
  }
}
