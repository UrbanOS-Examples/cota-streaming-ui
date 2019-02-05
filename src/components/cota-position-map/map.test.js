import React from 'react'
import { mount } from 'enzyme'
import CotaMap from './map'
import { Map } from 'react-leaflet'
import RotatedMarker from 'react-leaflet-rotatedmarker'
import iconFactory from './icon-factory'

describe('map', () => {
  const fakeIcon = {
    createIcon: () => (document.createElement('div')),
    createShadow: () => (document.createElement('div'))
  }
  let subject, vehicles

  beforeEach(() => {
    iconFactory.createBusIcon = jest.fn().mockReturnValue(fakeIcon)
    vehicles = [createVehicle(1, 123, 456, 970), createVehicle(2, -432, 5.32, 543)]
    subject = mount(<CotaMap data={vehicles} />)
  })

  it('has the prop fadeAnimation set to false, to improve performance', () => {
    expect(subject.find(Map).props().fadeAnimation).toEqual(false)
  })

  it('creates the correct number of rotating markers', () => {
    expect(subject.find(RotatedMarker).length).toEqual(vehicles.length)
  })

  it('creates each marker with the correct bearing', () => {
    expect(subject.find(RotatedMarker).map(it => it.props().rotationAngle)).toEqual(vehicles.map(it => it.bearing))
  })

  it('creates each marker with the correct position', () => {
    expect(subject.find(RotatedMarker).map(it => it.props().position)).toEqual(vehicles.map(it => [it.latitude, it.longitude]))
  })

  it('gives each marker a bus icon that is constructed with the default zoom level of 12', () => {
    expect(subject.find(RotatedMarker).map(it => it.props().icon)).toEqual(vehicles.map(it => fakeIcon))
    expect(iconFactory.createBusIcon.mock.calls).toEqual(vehicles.map(it => [12, "LeroyJenkins"]))
  })

  describe('viewport is updated', () => {
    beforeEach(() => {
      iconFactory.createBusIcon = jest.fn().mockReturnValue(fakeIcon)
      subject.find(Map).props().onViewportChanged({ zoom: 'some new zoom' })
      subject.update()
    })

    it('updates the icon scale when viewport is changed', () => {
      expect(iconFactory.createBusIcon.mock.calls).toEqual(vehicles.map(it => ['some new zoom', "LeroyJenkins"]))
    })
  })

  describe('click location buttons', () => {
    beforeEach(() => {
      vehicles = [createVehicle(1, 123, 456, 970), createVehicle(2, -432, 5.32, 543)]
      subject = mount(<CotaMap data={vehicles} />)
    })

    it('creates a marker if the state has found the location', () => {
      expect(subject.find('Marker').length).toBe(0)
      subject.setState({hasLocation: true})
      expect(subject.find('Marker').length).toBe(1)
    })
  })

  function createVehicle (vehicleId, lat = 1.23, lng = 3.21, bearing = 180) {
    return {
      vehicleId: vehicleId,
      routeId: 'my route',
      latitude: lat,
      longitude: lng,
      bearing: bearing,
      timestamp: 123000,
      provider: "LeroyJenkins"
    }
  }
})
