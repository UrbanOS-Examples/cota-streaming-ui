import "regenerator-runtime/runtime";
import { call, take, put, race, select } from 'redux-saga/effects'
import * as socketUtils from './websocket-utils'
import { ROUTE_FILTER, positionUpdate } from '../actions'
import { COTA } from '../variables'

/*
  socket.onOpen is sending the existing filters when the socket is opened.
  This solves the issue of the browser sending the original filter on a reconnection.
  This needs to be global state because socket.onOpen can not take a generator function,
  which is required to be executed to get data out of the Redux state
 */
let localStateFilters = []

const createChannel = function* (socket) {
  const channel = socket.channel('streaming:central_ohio_transit_authority__cota_stream', { 'vehicle.trip.route_id': [] })
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

const fromServer = function* (eventChannel) {
  while (true) {
    const message = yield take(eventChannel)
    if (message.vehicle !== undefined) {
      message.vehicle.provider = COTA
    }

    yield put(positionUpdate(message))
  }
}

const fromEventBus = function* (channel) {
  while (true) {
    const action = yield take(ROUTE_FILTER)
    localStateFilters = action.filter

    yield call(sendFilter, channel)
  }
}

const doSaga = function* () {
  localStateFilters = yield select(state => state.filter)
  const socket = yield call(socketUtils.createSocket, `${window.WEBSOCKET_HOST}/socket`)
  const channel = yield call(createChannel, socket)
  const eventChannel = yield call(socketUtils.createEventChannel, channel)

  yield race([call(fromEventBus, channel), call(fromServer, eventChannel)])
}

export default function* cotaWebSocketSaga() {
  while (true) {
    const action = yield take(ROUTE_FILTER)
    yield call(doSaga, action)
  }
}
