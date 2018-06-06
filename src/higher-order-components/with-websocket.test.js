import React from 'react'
import withWebsocket from './with-websocket'
import lodash from 'lodash'
import { shallow } from 'enzyme'

describe('with websocket', () => {
  let subject, FakeElement, openEventListener, messageEventListener, sendSpy

  const mockWebsocket = class MockWebsocket {
    constructor () {
      sendSpy = jest.fn()
      this.addEventListener = (eventType, fn) => {
        eventType === 'open' ? openEventListener = fn : messageEventListener = fn
      }
      this.send = sendSpy
    }
  }

  beforeEach(() => {
    window.WebSocket = mockWebsocket

    FakeElement = () => <div />

    const ElementWithWebsocket = withWebsocket(FakeElement, 'ws://my-websocket')

    subject = shallow(<ElementWithWebsocket />)
  })

  it('sends a phoenix websocket handshake when connection is opened', () => {
    let expected = {
      topic: 'vehicle_position',
      event: 'phx_join',
      payload: {},
      ref: '1'
    }

    openEventListener()

    expect(sendSpy).toHaveBeenCalledWith(JSON.stringify(expected))
  })

  it('passes the data prop with information from the websocket', () => {
    const fakeData = createTestData('id 1')

    messageEventListener(fakeData.message)

    subject.update()

    expect(subject.find(FakeElement).props().data).toEqual([fakeData.expected])
  })

  it('does not update the props if the event type is not update', () => {
    const fakeData = createTestData('id 1', 'not update')

    messageEventListener(fakeData.message)

    subject.update()

    expect(subject.find(FakeElement).props().data).toEqual([])
  })

  it('prepends data when data already exists', () => {
    const messages = [createTestData('id 1'), createTestData('id 2')]

    messages.forEach(it => messageEventListener(it.message))

    subject.update()

    expect(subject.find(FakeElement).props().data).toEqual(messages.reverse().map(it => it.expected))
  })

  it('only keeps the most recent 100 records', () => {
    const messages = lodash.times(100, index => createTestData(`id ${index}`))
    const latestMessage = createTestData('latest')

    messages.forEach(it => messageEventListener(it.message))
    messageEventListener(latestMessage.message)

    subject.update()

    expect(subject.find(FakeElement).props().data.length).toEqual(100)
    expect(subject.find(FakeElement).props().data[0]).toEqual(latestMessage.expected)
  })

  function createTestData (vehicleId, eventType = 'update') {
    const messageData = {
      event: eventType,
      payload: {
        vehicle: {
          vehicle: { id: vehicleId },
          trip: { route_id: 'my route' },
          position: { latitude: -1.23, longitude: 123.3 },
          timestamp: 123
        }
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
      message: { data: JSON.stringify(messageData) },
      expected: expectedValue
    }
  }
})
