import React from 'react'
import Select from 'react-select'
import _ from 'lodash'
import './route-filter.scss'
import ReactGA from 'react-ga'

export default class extends React.Component {
  componentDidMount = () => {
    this.props.routeFetch()
  }

  handleChange = selectedOption => {
    const value = _.flatten([selectedOption])
      .map(option => option.value)
      .filter(option => option)

      this.props.routeFilter(value)

    ReactGA.event({
      category: 'Navigation',
      action: 'Route Selected',
      label: selectedOption.label
    })
  }

  render = () => {
    const { routes, selectedRouteId } = this.props
    const selectedRoute = _.find(routes, {value: selectedRouteId})

    return <route-filter>
      <Select
        id='routeSelect'
        value={selectedRoute}
        onChange={this.handleChange}
        options={routes}
        placeholder=''
        backspaceRemovesValue={false}
        isSearchable={false}
      />
    </route-filter>
  }
}
