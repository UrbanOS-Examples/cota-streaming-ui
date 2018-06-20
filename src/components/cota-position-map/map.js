import React from 'react'
import { Map, TileLayer } from 'react-leaflet'
import RotatedMarker from 'react-leaflet-rotatedmarker'
import iconFactory from './icon-factory'
import './map.scss'

export default class extends React.Component {
  constructor (props) {
    super(props)
    this.defaultZoom = 12
    this.state = { zoom: this.defaultZoom }
  }

  render () {
    return (
      <Map center={[39.9612, -82.9988]} zoom={this.defaultZoom} onViewportChanged={viewport => this.onViewportChanged(viewport)}>
        <TileLayer url='http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png' />
        {this.props.data.map(it => <RotatedMarker key={it.vehicleId} position={[it.latitude, it.longitude]} rotationAngle={it.bearing} icon={iconFactory.createBusIcon(this.state.zoom)} />)}
      </Map>
    )
  }

  onViewportChanged (viewport) {
    this.setState({ zoom: viewport.zoom })
  }
}
