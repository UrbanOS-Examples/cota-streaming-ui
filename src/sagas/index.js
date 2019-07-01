import webSocketSaga from './websocket'
import shuttleWebSocketSaga from './shuttleWebSocketSaga'
import routeSaga from './route'
import { fork, all } from 'redux-saga/effects'

export default function* allSagas() {
  yield all([
    fork(webSocketSaga),
    fork(shuttleWebSocketSaga),
    fork(routeSaga)
  ])
}
