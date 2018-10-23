import { call, take, put, race, select } from 'redux-saga/effects'
import { eventChannel } from 'redux-saga'
import { Socket } from 'phoenix'
import { ROUTE_FILTER, positionUpdate } from '../actions'

/*
  socket.onOpen is sending the existing filters when the socket is opened.
  This solves the issue of the browser sending the original filter on a reconnection.
  This needs to be global state because socket.onOpen can not take a generator function,
  which is required to be executed to get data out of the Redux state
 */
let localStateFilters = []

export let createSocket = (socketUrl) => {
  let socket = new Socket(socketUrl)
  socket.connect()
  return socket
}

const createChannel = function * (socket) {
  const channel = socket.channel('vehicle_position', { 'vehicle.trip.route_id': [] })
  localStateFilters = yield select(state => state.filter)
  socket.onOpen(() => sendFilter(channel))

  return channel
}

const hasFilterDefined = (array) => {
  return Array.isArray(array) && array.length > 0
}

const sendFilter = (channel) => {
  const filter = hasFilterDefined(localStateFilters) ? { 'vehicle.trip.route_id': localStateFilters } : {}
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
    localStateFilters = action.filter

    yield call(sendFilter, channel)
  }
}

export default function * websocketSaga () {
  const socket = yield call(createSocket, `${window.WEBSOCKET_HOST}/socket`)
  const channel = yield call(createChannel, socket)
  const eventChannel = yield call(createEventChannel, channel)

  yield race([call(fromEventBus, channel), call(fromServer, eventChannel)])
}
