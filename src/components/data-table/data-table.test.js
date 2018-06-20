import React from 'react'
import DataTable from './data-table'
import moment from 'moment'
import { shallow } from 'enzyme'

describe('table renders list elements based on props', () => {
  let subject, testData

  beforeEach(() => {
    testData = [
      {
        vehicleId: '12939',
        routeId: '152',
        latitude: 39.998947143555,
        longitude: -82.885498046875,
        timestamp: 1527795212243
      },
      {
        vehicleId: '54987',
        routeId: '341',
        latitude: 39.9403546,
        longitude: -82.3,
        timestamp: 1527756184653
      }
    ]

    subject = shallow(<DataTable data={testData} />)
  })

  it('creates all the vehicle ids', () => {
    const foundVehicleIds = subject.find('.vehicle-id')
    expect(foundVehicleIds.map(it => it.text())).toEqual(testData.map(it => it.vehicleId))
  })

  it('creates all the route ids', () => {
    const foundVehicleIds = subject.find('.route-id')
    expect(foundVehicleIds.map(it => it.text())).toEqual(testData.map(it => it.routeId))
  })

  it('creates all the latitudes', () => {
    const foundVehicleIds = subject.find('.latitude')
    expect(foundVehicleIds.map(it => it.text())).toEqual(testData.map(it => it.latitude.toString()))
  })

  it('creates all the longitudes', () => {
    const foundVehicleIds = subject.find('.longitude')
    expect(foundVehicleIds.map(it => it.text())).toEqual(testData.map(it => it.longitude.toString()))
  })

  it('creates all the timestamps with correct formatting', () => {
    const foundVehicleIds = subject.find('.timestamp')
    const expectedValue = testData.map(it => it.timestamp).map(it => moment(it).toISOString())
    expect(foundVehicleIds.map(it => it.text())).toEqual(expectedValue)
  })
})
