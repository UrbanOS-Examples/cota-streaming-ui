import leaflet from 'leaflet'
import busSvg from '../../ic-cotaBus.svg'
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
      iconUrl: busSvg,
      iconSize: [32, 27.5]
    })
  })
})
