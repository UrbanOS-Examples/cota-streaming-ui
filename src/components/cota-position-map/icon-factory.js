import leaflet from 'leaflet'
import busBlueSvg from '../../assets/blue-bus.svg'
import locationPin from '../../assets/ic_location-dot.svg'

const createBusIcon = (zoomLevel, provider) => {
  let iconUrl = busBlueSvg
  let iconSize = [3.2 * zoomLevel, 2.75 * zoomLevel]

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
