import React from 'react'
import COTAPositionMap from './components/cota-position-map'
import Header from './components/header'

import './App.scss'

export default () => (
  <main-app-element>
    <Header />
    <div className='main-content'>
      <COTAPositionMap />
    </div>
  </main-app-element>
)
