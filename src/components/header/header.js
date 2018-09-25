import React from 'react'
import scosLogo from '../../assets/smrt-columbus.png'
import cotaLogo from '../../assets/COTA-logo.svg'
import './header.scss'

export default () => (
  <app-header>
    <div className='logos'>
      <img src={scosLogo} className='app-logo' alt='logo' />
      <div className='conjunction-junction'>+</div>
      <img src={cotaLogo} className='cota-logo' alt='logo' />
    </div>
    <a className='about-map-button' href='#'>About This Map</a>
  </app-header>
)
