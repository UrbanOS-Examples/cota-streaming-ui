import leaflet from 'leaflet'
import busBlueSvg from '../../assets/blue-bus.svg'
import busGreenSvg from '../../assets/green-bus.svg'
import locationPin from '../../assets/ic_location-dot.svg'

const createBusIcon = (zoomLevel, provider) => {
  let iconUrl = busBlueSvg;
  if('CEAV' === provider) {
    iconUrl = busGreenSvg
  }
  
  return leaflet.icon({
    iconUrl: iconUrl,
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
