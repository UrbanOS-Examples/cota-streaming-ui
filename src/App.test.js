import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { shallow, render } from 'enzyme'
import { WebSocket, Server } from 'mock-socket'

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

global.WebSocket = WebSocket

describe('basic app', () => {

  it('renders without crashing', () => {
    const subject= shallow(<App />)
    expect(subject.find('.App-header')).toHaveLength(1)
  })
})
