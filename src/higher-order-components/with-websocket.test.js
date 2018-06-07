import React from 'react'
import withWebsocket from './with-websocket'
import lodash from 'lodash'
import { shallow } from 'enzyme'

describe('with websocket', () => {
  let subject, FakeElement

  beforeEach(() => {
    FakeElement = () => <div />

    const ElementWithWebsocket = withWebsocket(FakeElement, 'ws://my-websocket')

    subject = shallow(<ElementWithWebsocket />)
  })

  it('passes the data prop with information from the websocket', () => {
    const fakeData = createTestData('id 1')

    subject.instance().onMessageArrived(fakeData.message)

    subject.update()

    expect(subject.find(FakeElement).props().data).toEqual([fakeData.expected])
  })

  it('prepends data when data already exists', () => {
    const messages = [createTestData('id 1'), createTestData('id 2')]

    messages.forEach(it => subject.instance().onMessageArrived(it.message))

    subject.update()

    expect(subject.find(FakeElement).props().data).toEqual(messages.reverse().map(it => it.expected))
  })

  it('only keeps the most recent 100 records', () => {
    const messages = lodash.times(100, index => createTestData(`id ${index}`))
    const latestMessage = createTestData('latest')

    messages.forEach(it => subject.instance().onMessageArrived(it.message))
    subject.instance().onMessageArrived(latestMessage.message)

    subject.update()

    expect(subject.find(FakeElement).props().data.length).toEqual(100)
    expect(subject.find(FakeElement).props().data[0]).toEqual(latestMessage.expected)
  })

  function createTestData (vehicleId, eventType = 'update') {
    const messageData = {
      vehicle: {
        vehicle: { id: vehicleId },
        trip: { route_id: 'my route' },
        position: { latitude: -1.23, longitude: 123.3 },
        timestamp: 123
      }
    }

    const expectedValue = {
      'vehicleID': vehicleId,
      'routeID': 'my route',
      'latitude': -1.23,
      'longitude': 123.3,
      'timestamp': 123000
    }

    return {
      message: messageData,
      expected: expectedValue
    }
  }
})
