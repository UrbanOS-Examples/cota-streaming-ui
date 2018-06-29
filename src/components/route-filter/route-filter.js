import React from 'react'

export default class extends React.Component {
    onKeyUp = (e) => {
      if (e.key === 'Enter') {
        const value = e.target.value !== '' ? [e.target.value] : []
        this.props.routeFilter(value)
      }
    }

    render = () => {
      return <route-filter><br /><input type='text' name='route-filter' placeholder='Filter By Route' onKeyUp={this.onKeyUp} /></route-filter>
    }
}
