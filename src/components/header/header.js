import React from 'react'
import scosLogo from '../../assets/smrt-columbus.png'
import cotaLogo from '../../assets/COTA-logo.svg'
import './header.scss'

const DATA_FEED_PATH = '/data-stories/streaming-data-feed-shows-riders-where-their-bus-is-in-real-time'

export default () => (
  <app-header>
    <div className='logos'>
      <img src={scosLogo} className='app-logo' alt='logo' />
      <div className='conjunction-junction'>+</div>
      <img src={cotaLogo} className='cota-logo' alt='logo' />
    </div>
    <a className='about-map-button' target='_blank' href={window.JOOMLA_HOST + DATA_FEED_PATH}>About This Map</a>
  </app-header>
)
