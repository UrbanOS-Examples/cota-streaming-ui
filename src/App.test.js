import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { shallow } from 'enzyme'
import { WebSocket, Server } from 'mock-socket'

global.WebSocket = WebSocket

describe('basic app', () => {

  it('renders without crashing', () => {
    const subject= shallow(<App />)
    expect(subject.find('.App-header')).toHaveLength(1)
  })
})
