import React from 'react'
import cotaLogo from '../../assets/cota-logo.png'
import './header.scss'

export default () => (
  <app-header>
    <img src={cotaLogo} className='app-logo' alt='logo' />
    <h1 className='app-title'>Real-Time COTA Data</h1>
  </app-header>
)
