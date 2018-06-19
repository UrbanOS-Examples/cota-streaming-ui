import leaflet from 'leaflet'
import busSvg from '../../ic-cotaBus.svg'
import iconFactory from './icon-factory'

describe('Icon Factory', () => {
  beforeEach(() => {
    leaflet.icon = jest.fn()
  })

  it('creates the icon scaled properly with a scale value of 1', () => {
    iconFactory.createBusIcon(1)

    expect(leaflet.icon).toHaveBeenCalledWith({
      iconUrl: busSvg,
      iconSize: [3.2, 2.75]
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