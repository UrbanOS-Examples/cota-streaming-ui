import webSocketSaga from './websocket'
import routeSaga from './route'
import { fork, all } from 'redux-saga/effects'

export default function* allSagas() {
  yield all([
    fork(webSocketSaga),
    fork(routeSaga)
  ])
}
