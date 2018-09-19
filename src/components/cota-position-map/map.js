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
          <TileLayer url='https://{s}.tiles.mapbox.com/styles/v1/mapbox/streets-v10/tiles/{z}/{x}/{y}{r}?access_token=pk.eyJ1Ijoic21ydGNidXMiLCJhIjoiY2ptMTB6YjIzMGVuazNwcWcyczk3a2ZmNSJ9.SjVhquTC7K5RzbGqoGZUYg' />
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
