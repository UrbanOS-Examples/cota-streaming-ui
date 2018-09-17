import leaflet from 'leaflet'
import busSvg from '../../assets/blue-bus.svg'

const createBusIcon = zoomLevel => {
  return leaflet.icon({
    iconUrl: busSvg,
    iconSize: [3.2 * zoomLevel, 2.75 * zoomLevel]
  })
}

export default { createBusIcon }
