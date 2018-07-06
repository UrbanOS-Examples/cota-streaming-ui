import React from 'react'
import BusMap from './connect'
import { shallow } from 'enzyme'

describe('BusMap', () => {
  it('converts key value state data to a list of vehicle positions', () => {
    let data = [
      {
        vehicleId: '1234',
        latitude: 38.92,
        longitude: 45.73,
        bearing: 90
      },
      {
        vehicleId: '8765',
        latitude: 51.3,
        longitude: 7.0,
        bearing: 273
      }
    ]

    let fakeStore = {
      getState: () => {
        return {
          data: data.reduce((acc, next) => {
            acc[next.vehicleId] = next
            return acc
          }, {})
        }
      },
      subscribe: () => {},
      dispatch: jest.fn()
    }
    let wrapper = shallow(<BusMap store={fakeStore} />)
    expect(wrapper.find('Component').props().data).toEqual(data)
  })
})
