import { call, take, put, race, select } from 'redux-saga/effects'
import { eventChannel } from 'redux-saga'
import { Socket } from 'phoenix'
import { ceavUpdate } from '../actions'
import { CEAV } from '../variables'

/*
  socket.onOpen is sending the existing filters when the socket is opened.
  This solves the issue of the browser sending the original filter on a reconnection.
  This needs to be global state because socket.onOpen can not take a generator function,
  which is required to be executed to get data out of the Redux state
 */

export let createSocket = (socketUrl) => {
  let socket = new Socket(socketUrl)
  socket.connect()
  return socket
}

const createChannel = (socket) => {
  return socket.channel('streaming:ceav-vehicle-locations', {})
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
    message.vehicle.provider = CEAV

    let provider = yield select(state => state.provider.name)
    if(provider === CEAV) {
      yield put(ceavUpdate(message))
    }
  }
}

export default function * websocketSaga () {
  const socket = yield call(createSocket, `${window.WEBSOCKET_HOST}/socket`)
  const channel = yield call(createChannel, socket)
  const eventChannel = yield call(createEventChannel, channel)

  yield race([call(fromServer, eventChannel)])
}
