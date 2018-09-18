import leaflet from 'leaflet'
import busSvg from '../../assets/blue-bus.svg'
import locationPin from '../../assets/red-bus.svg'

const createIcon = (zoomLevel, iconType) => {
  return leaflet.icon({
    iconUrl: iconType,
    iconSize: [3.2 * zoomLevel, 2.75 * zoomLevel]
  })
}

const createBusIcon = zoomLevel => {
  return createIcon(zoomLevel, busSvg)
}

const createLocationIcon = zoomLevel => {
  return createIcon(zoomLevel, locationPin)
}

export default { createBusIcon, createLocationIcon }
