import React from 'react'
import Select from 'react-select'
import _ from 'lodash'
import './dropdown-route-filter.scss'
import ReactGA from 'react-ga'

export default class extends React.Component {
  componentDidMount = () => {
    this.props.fetchAvailableRoutes()
  }

  handleChange = selectedOption => {
    const value = _.flatten([selectedOption])
      .map(option => option.value)
      .filter(option => option)

    this.props.applyStreamFilter(value)

    ReactGA.event({
      category: 'Navigation',
      action: 'Route Selected',
      label: selectedOption.label
    })
  }

  render = () => {
    const { availableRoutes, selectedRouteId } = this.props
    const selectedRoute = _.find(availableRoutes, { value: selectedRouteId })

    return <dropdown-route-filter>
      <Select
        id='routeSelect'
        value={selectedRoute}
        onChange={this.handleChange}
        options={availableRoutes}
        placeholder=''
        backspaceRemovesValue={false}
        isSearchable={false}
      />
    </dropdown-route-filter>
  }
}
