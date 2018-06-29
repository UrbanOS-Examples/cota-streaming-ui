import { call, take, put, race } from 'redux-saga/effects'
import { eventChannel } from 'redux-saga'
import { Socket } from 'phoenix'
import { ROUTE_FILTER, positionUpdate } from '../actions'

export let createSocket = (socketUrl) => {
  let socket = new Socket(socketUrl)
  socket.connect()
  return socket
}

const createChannel = socket => {
  return socket.channel('vehicle_position')
}

const hasFilterDefined = (array) => {
  return Array.isArray(array) && array.length > 0
}

const sendFilter = (channel, action) => {
  const filter = hasFilterDefined(action.filter) ? { 'vehicle.trip.route_id': action.filter } : {}
  channel.push('filter', filter)
}

const unsubscribe = () => { }

const createEventChannel = channel => {
  return eventChannel(emit => {
    channel.on('update', emit)

    channel.join()
      .receive('ok', () => console.log('Connection Successful'))
      .receive('error', ({ reason }) => console.log('failed join', reason))
      .receive('timeout', () => console.log('Networking issue. Still waiting...'))

    return unsubscribe
  })
}

const fromServer = function * (eventChannel) {
  while (true) {
    const message = yield take(eventChannel)
    yield put(positionUpdate(message))
  }
}

const fromEventBus = function * (channel) {
  while (true) {
    const action = yield take(ROUTE_FILTER)
    yield call(sendFilter, channel, action)
  }
}

export default function * websocketSaga () {
  const socket = yield call(createSocket, `ws://${window.WEBSOCKET_HOST}/socket`)
  const channel = yield call(createChannel, socket)
  const eventChannel = yield call(createEventChannel, channel)

  yield race([call(fromEventBus, channel), call(fromServer, eventChannel)])
}
