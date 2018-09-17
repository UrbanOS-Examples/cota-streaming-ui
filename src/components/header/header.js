import React from 'react'
import scosLogo from '../../assets/smrt-columbus.png'
import './header.scss'

export default () => (
  <app-header>
    <div className='logos'>
      <img src={scosLogo} className='cota-logo' alt='logo' />
      <div className='conjunction-junction'>+</div>
      <img src={'https://upload.wikimedia.org/wikipedia/en/thumb/b/b0/Cota-logo.svg/1280px-Cota-logo.svg.png'} className='app-logo' alt='logo' />
    </div>
    <a className='about-map-button' href='#'>About This Map</a>
  </app-header>
)
