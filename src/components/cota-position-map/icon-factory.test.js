import leaflet from 'leaflet'
import busBlueSvg from '../../assets/blue-bus.svg'
import smartCircuitIcon from '../../assets/smart_circuit.svg'
import iconFactory from './icon-factory'
import locationPin from '../../assets/ic_location-dot.svg'

describe('Icon Factory', () => {
  beforeEach(() => {
    leaflet.icon = jest.fn()
  })

  it('creates the icon scaled properly with a scale value of 1', () => {
    iconFactory.createLocationIcon(1)

    expect(leaflet.icon).toHaveBeenCalledWith({
      iconUrl: locationPin,
      iconSize: [2, 2]
    })
  })

  it('creates the icon scaled properly with a scale value of 10', () => {
    iconFactory.createBusIcon(10)

    expect(leaflet.icon).toHaveBeenCalledWith({
      iconUrl: busBlueSvg,
      iconSize: [32, 27.5]
    })
  })

  it('creates green bus icons for CEAV shuttles', () => {
    iconFactory.createBusIcon(10, "CEAV")

    expect(leaflet.icon).toHaveBeenCalledWith({
      iconUrl: smartCircuitIcon,
      iconSize: [20, 20]
    })
  })
})
