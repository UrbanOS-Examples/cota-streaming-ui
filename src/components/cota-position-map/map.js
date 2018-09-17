import React from 'react'
import { Map, TileLayer, ZoomControl } from 'react-leaflet'
import RotatedMarker from 'react-leaflet-rotatedmarker'
import iconFactory from './icon-factory'
import Loader from 'react-loader'
import './map.scss'

export default class extends React.Component {
  constructor (props) {
    super(props)
    this.defaultZoom = 12
    this.state = { zoom: this.defaultZoom }
  }

  render () {
    return (
      <map-element>
        <Map fadeAnimation={false} center={[39.9612, -82.9988]} zoom={this.defaultZoom} zoomControl={false} onViewportChanged={viewport => this.onViewportChanged(viewport)}>
          <TileLayer url='http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png' />
          <Loader loaded={this.props.data.length > 0} length={20} radius={15} color='#1C2859' speed={1.2}>
            {this.props.data.map(it => <RotatedMarker key={it.vehicleId} position={[it.latitude, it.longitude]} rotationAngle={it.bearing} icon={iconFactory.createBusIcon(this.state.zoom)} />)}
          </Loader>
          <ZoomControl position='bottomright' />
        </Map>
      </map-element>
    )
  }

  onViewportChanged (viewport) {
    this.setState({ zoom: viewport.zoom })
  }
}
