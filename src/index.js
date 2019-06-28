import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
// import './leaflet.css'
import 'normalize.css'
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import createSagaMiddleware from 'redux-saga'
import reducers from './reducers'
import sagas from './sagas'
import App from './App'
import ReactGA from 'react-ga'

const sagaMiddleware = createSagaMiddleware()

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const store = createStore(reducers, composeEnhancers(applyMiddleware(sagaMiddleware)))

if (window.location.hostname === 'cota.smartcolumbusos.com') {
  ReactGA.initialize('UA-125881268-1')
  ReactGA.pageview(window.location.pathname + window.location.search)
}

sagaMiddleware.run(sagas)

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'))
