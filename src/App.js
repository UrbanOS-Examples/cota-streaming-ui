import React from 'react'
import COTAPositionMap from './components/cota-position-map'
import DataTable from './components/data-table'
import Header from './components/header'

import './App.scss'

export default () => (
  <main-app-element>
    <Header />
    <div className='main-content'>
      <COTAPositionMap />
      <DataTable />
    </div>
  </main-app-element>
)
