import React from 'react'
import COTAPositionMap from './components/cota-position-map'
import DropdownRouteFilter from './components/dropdown-route-filter'
import UrlRouteFilter from './components/url-route-filter'
import Header from './components/header'
import { HashRouter as Router, Route } from 'react-router-dom'

import './App.scss'

export default () => (
  <main-app-element>
    <Header />
    <div className='main-content'>
      <Router>
        <DropdownRouteFilter />
        <Route path='/:routeId?' component={UrlRouteFilter} />
        <COTAPositionMap />
      </Router>
    </div>
  </main-app-element>
)
