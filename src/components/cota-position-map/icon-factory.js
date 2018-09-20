import leaflet from 'leaflet'
import busSvg from '../../assets/blue-bus.svg'
import locationPin from '../../assets/ic_location-dot.svg'

const createBusIcon = zoomLevel => {
  return leaflet.icon({
    iconUrl: busSvg,
    iconSize: [3.2 * zoomLevel, 2.75 * zoomLevel]
  })
}

const createLocationIcon = zoomLevel => {
  return leaflet.icon({
    iconUrl: locationPin,
    iconSize: [2 * zoomLevel, 2 * zoomLevel]
  })
}

export default { createBusIcon, createLocationIcon }
