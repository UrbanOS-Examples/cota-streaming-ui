import cotaWebSocketSaga from './cotaWebSocket'
import leapWebSocketSaga from './leapWebSocket'
import routeSaga from './route'
import { fork, all } from 'redux-saga/effects'

export default function* allSagas() {
  yield all([
    fork(cotaWebSocketSaga),
    fork(leapWebSocketSaga),
    fork(routeSaga)
  ])
}
