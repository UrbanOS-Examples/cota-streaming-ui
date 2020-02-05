import { call, take, put, race, select } from 'redux-saga/effects'
import * as socketUtils from './websocket-utils'
import { leapPositionUpdate, ROUTE_FILTER } from '../actions'
import { LEAP } from '../variables'

const createChannel = (socket) => {
  return socket.channel('streaming:easymile__linden_positions', {})
}

const fromServer = function* (eventChannel) {
  while (true) {
    const message = yield take(eventChannel)
    if (message !== undefined) {
      message.provider = LEAP
    }

    let provider = yield select(state => state.provider.name)
    if (provider === LEAP) {
      yield put(leapPositionUpdate(message))
    }
  }
}

const fromEventBus = function* (channel) {
  while (true) {
    const action = yield take(ROUTE_FILTER)
    if (LEAP === action.filter[0]) {
      channel.push('filter', {})
    }
  }
}

const doSaga = function* () {
  const socket = yield call(socketUtils.createSocket, `${window.WEBSOCKET_HOST}/socket`)
  const channel = yield call(createChannel, socket)
  const eventChannel = yield call(socketUtils.createEventChannel, channel)

  yield race([call(fromEventBus, channel), call(fromServer, eventChannel)])
}

export default function* leapWebSocketSaga() {
  while (true) {
    const action = yield take(ROUTE_FILTER)
    yield call(doSaga, action)
  }
}