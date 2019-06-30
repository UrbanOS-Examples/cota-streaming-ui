import React, { createRef } from 'react'
import { Map as LeafletMap, TileLayer, ZoomControl, Marker } from 'react-leaflet'
import RotatedMarker from 'react-leaflet-rotatedmarker'
import iconFactory from './icon-factory'
import './map.scss'

export default class extends React.Component {
  constructor (props) {
    super(props)
    this.defaultZoom = 12
    this.state = {
      zoom: this.defaultZoom,
      hasLocation: false,
      center: [39.9612, -82.9988]
    }
    this.mapRef = createRef()
  }

  componentDidMount () {
    this.mapRef.current.leafletElement.locate({timeout: 30000})
  }

  render () {
    const marker = this.state.hasLocation ? (
      <Marker position={this.state.center} icon={iconFactory.createLocationIcon(this.state.zoom)} zIndexOffset={1000} />
    ) : null
    const accessToken = 'pk.eyJ1Ijoic21ydGNidXMiLCJhIjoiY2ptMTB6YjIzMGVuazNwcWcyczk3a2ZmNSJ9.SjVhquTC7K5RzbGqoGZUYg'

    return (
      <map-element>
        <LeafletMap
          fadeAnimation={false}
          ref={this.mapRef}
          center={this.state.center}
          zoom={this.defaultZoom}
          zoomControl={false}
          onViewportChanged={viewport => this.onViewportChanged(viewport)}
          onLocationfound={e => this.handleLocationFound(e)}
        >
          <TileLayer url={`https://{s}.tiles.mapbox.com/styles/v1/mapbox/streets-v10/tiles/{z}/{x}/{y}{r}?access_token=${accessToken}`} />
          {this.props.data.map(it => <RotatedMarker key={it.vehicleId} position={[it.latitude, it.longitude]} rotationAngle={it.bearing} icon={iconFactory.createBusIcon(this.state.zoom, it.provider)} />)}
          <ZoomControl position='topright' />
          {marker}
        </LeafletMap>
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
    this.mapRef.current.leafletElement.setZoomAround(e.latlng, 14, true)
  }
}
