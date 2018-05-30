import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { WebSocket } from 'mock-socket'

global.WebSocket = WebSocket

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<App />, div)
  ReactDOM.unmountComponentAtNode(div)
})
