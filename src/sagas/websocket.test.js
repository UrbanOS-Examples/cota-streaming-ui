import { Socket } from 'phoenix'
import sagas from './websocket'
import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { POSITION_UPDATE, ROUTE_FILTER } from '../actions'

jest.mock('phoenix')

const reducer = (state = [], action) => {
  return [...state, action]
}

describe('websocketSaga', () => {
  let channel, on, push, store
  beforeEach(() => {
    channel = jest.fn()
    on = jest.fn()
    push = jest.fn()
    Socket.mockImplementation(() => ({
      connect: jest.fn(),
      channel: channel.mockReturnValue({
        on: on,
        push: push,
        join: jest.fn().mockReturnValue({
          receive: jest.fn().mockReturnValue({
            receive: jest.fn().mockReturnValue({
              receive: jest.fn()
            })
          })
        })
      })
    }))

    let sagaMiddleware = createSagaMiddleware()
    store = createStore(reducer, applyMiddleware(sagaMiddleware))
    sagaMiddleware.run(sagas)
  })

  it('establishes a connection to socket and channel', () => {
    expect(Socket).toBeCalledWith('ws://undefined/socket')
    expect(channel).toBeCalledWith('vehicle_position')
  })

  it('puts messages on event bus when position updates come from the server', () => {
    let [eventType, emitter] = on.mock.calls[0]
    emitter({abc: 'test'})

    expect(eventType).toBe('update')
    expect(store.getState()).toContainEqual({type: POSITION_UPDATE, update: {abc: 'test'}})
  })

  it('pushes a filter to the channel based on a ROUTE_FILTER event', () => {
    store.dispatch({type: ROUTE_FILTER, 'filter': ['yahtzee']})
    expect(push).toBeCalledWith('filter', {'vehicle.trip.route_id': ['yahtzee']})
  })

  it('pushes no filter to the channel when filter is an empty list', () => {
    store.dispatch({type: ROUTE_FILTER, 'filter': []})
    expect(push).toBeCalledWith('filter', {})
  })

  it('pushes no filter to the channel when filter is undefined', () => {
    store.dispatch({type: ROUTE_FILTER})
    expect(push).toBeCalledWith('filter', {})
  })
})
