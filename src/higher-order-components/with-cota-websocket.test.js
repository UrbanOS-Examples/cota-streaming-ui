import React from 'react'
import withCotaWebsocket from './with-cota-websocket'
import lodash from 'lodash'
import { shallow } from 'enzyme'

describe('with websocket', () => {
  let subject, FakeElement

  beforeEach(() => {
    FakeElement = () => <div />

    const ElementWithWebsocket = withCotaWebsocket(FakeElement, 'ws://my-websocket')

    subject = shallow(<ElementWithWebsocket />)
  })

  it('passes the data prop with information from the websocket', () => {
    const fakeData = createTestData('id 1')

    simulateMessageArrived(fakeData.message)

    expect(subject.find(FakeElement).props().data).toEqual([fakeData.expected])
  })

  it('passes the data prop with defaulted bearing when one is not present', () => {
    const fakeData = createTestData('id 1')
    delete fakeData.message.vehicle.position.bearing
    fakeData.expected.bearing = 0

    simulateMessageArrived(fakeData.message)

    expect(subject.find(FakeElement).props().data).toEqual([fakeData.expected])
  })

  it('updates the existing vehicle data when a non-duplicate vehicle id is recieved', () => {
    let allMsgs = [createTestData('id 1'), createTestData('id 2')]

    allMsgs.forEach(it => simulateMessageArrived(it.message))

    expect(subject.find(FakeElement).props().data).toEqual(allMsgs.map(it => it.expected))
  })

  it('updates the existing vehicle data when a duplicate vehicle id is recieved', () => {
    const message1 = createTestData('id 1')
    const message2 = createTestData('id 2')
    const message3 = createTestData('id 3')
    const updateMessage = createTestData('id 2', 123, 567)

    lodash.forEach([message1, message2, message3, updateMessage], it => simulateMessageArrived(it.message))

    expect(subject.find(FakeElement).props().data).toEqual([message1, updateMessage, message3].map(it => it.expected))
  })

  function simulateMessageArrived (message) {
    subject.instance().onMessageArrived(message)
    subject.update()
  }

  function createTestData (vehicleId, lat = -1.23, lng = 123.3) {
    const messageData = {
      vehicle: {
        vehicle: { id: vehicleId },
        trip: { route_id: 'my route' },
        position: { latitude: lat, longitude: lng, bearing: 270 },
        timestamp: 123
      }
    }

    const expectedValue = {
      vehicleId: vehicleId,
      routeId: 'my route',
      latitude: lat,
      longitude: lng,
      bearing: 270,
      timestamp: 123000
    }

    return {
      message: messageData,
      expected: expectedValue
    }
  }
})
