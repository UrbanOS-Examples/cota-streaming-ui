import leaflet from 'leaflet'
import busBlueSvg from '../../assets/blue-bus.svg'
import ceavSvg from '../../assets/smart_circuit.svg'
import locationPin from '../../assets/ic_location-dot.svg'
import { CEAV } from '../../variables';

const createBusIcon = (zoomLevel, provider) => {
  let iconUrl =  busBlueSvg
  let iconSize = [3.2 * zoomLevel, 2.75 * zoomLevel]
  if(CEAV === provider) {
      iconUrl = ceavSvg
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
