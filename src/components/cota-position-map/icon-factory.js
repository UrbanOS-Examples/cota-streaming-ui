import leaflet from 'leaflet'
import busSvg from '../../ic-cotaBus.svg'

const createBusIcon = zoomLevel => {
  return leaflet.icon({
    iconUrl: busSvg,
    iconSize: [3.2 * zoomLevel, 2.75 * zoomLevel]
  })
}

export default { createBusIcon }
