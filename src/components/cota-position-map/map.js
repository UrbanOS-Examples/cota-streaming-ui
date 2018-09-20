import React, { createRef } from 'react'
import { Map, TileLayer, ZoomControl, Marker } from 'react-leaflet'
import RotatedMarker from 'react-leaflet-rotatedmarker'
import iconFactory from './icon-factory'
import Loader from 'react-loader'
import './map.scss'

export default class extends React.Component {
  constructor (props) {
    super(props)
    this.defaultZoom = 12
    this.state = {
      zoom: this.defaultZoom,
      hasLocation: false,
      latlng: {
        lat: 39.9612,
        lng: -82.9988
      }
    }
    this.mapRef = createRef()
  }

  componentDidMount () {
    this.mapRef.current.leafletElement.locate({timeout: 30000})
  }

  render () {
    const marker = this.state.hasLocation ? (
      <Marker position={this.state.latlng} icon={iconFactory.createLocationIcon(this.state.zoom)} zIndexOffset={1000} />
    ) : null
    const accessToken = 'pk.eyJ1Ijoic21ydGNidXMiLCJhIjoiY2ptMTB6YjIzMGVuazNwcWcyczk3a2ZmNSJ9.SjVhquTC7K5RzbGqoGZUYg'

    return (
      <map-element>
        <Map
          fadeAnimation={false}
          ref={this.mapRef}
          center={this.state.latlng}
          zoom={this.defaultZoom}
          zoomControl={false}
          onViewportChanged={viewport => this.onViewportChanged(viewport)}
          onLocationfound={e => this.handleLocationFound(e)}
        >
          <TileLayer url={`https://{s}.tiles.mapbox.com/styles/v1/mapbox/streets-v10/tiles/{z}/{x}/{y}{r}?access_token=${accessToken}`} />
          <Loader loaded={this.props.data.length > 0} length={20} radius={15} color='#1C2859' speed={1.2}>
            {this.props.data.map(it => <RotatedMarker key={it.vehicleId} position={[it.latitude, it.longitude]} rotationAngle={it.bearing} icon={iconFactory.createBusIcon(this.state.zoom)} />)}
          </Loader>
          <ZoomControl position='topright' />
          {marker}
        </Map>
      </map-element>
    )
  }

  onViewportChanged (viewport) {
    this.setState({ zoom: viewport.zoom })
  }

  handleLocationFound = e => {
    this.setState({
      hasLocation: true,
      latlng: e.latlng
    })
    this.mapRef.current.leafletElement.setZoomAround(e.latlng, 16, true)
  }
}
