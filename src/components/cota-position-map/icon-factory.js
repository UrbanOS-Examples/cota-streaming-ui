import leaflet from 'leaflet'
import busBlueSvg from '../../assets/blue-bus.svg'
import easymileSvg from '../../assets/map-marker-easymile.svg'
import locationPin from '../../assets/ic_location-dot.svg'
import { LEAP } from '../../variables'

const createBusIcon = (zoomLevel, provider) => {
  let iconUrl = busBlueSvg
  let iconSize = [3.2 * zoomLevel, 2.75 * zoomLevel]

  if (LEAP == provider) {
    iconUrl = easymileSvg
    iconSize = [2 * zoomLevel, 2 * zoomLevel]
  }

  return leaflet.icon({
    iconUrl: iconUrl,
    iconSize: iconSize
  })
}

const createLocationIcon = zoomLevel => {
  return leaflet.icon({
    iconUrl: locationPin,
    iconSize: [2 * zoomLevel, 2 * zoomLevel]
  })
}

export default { createBusIcon, createLocationIcon }
