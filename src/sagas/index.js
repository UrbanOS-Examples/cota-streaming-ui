import webSocketSaga from './websocket'
import routeSaga from './route'
import { fork } from 'redux-saga/effects'

export default function * allSagas () {
  yield [
    fork(webSocketSaga),
    fork(routeSaga)
  ]
}
