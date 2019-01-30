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

      // this.props.ceavFilter(value)
      // this.props.routeFilter(value)
      if('001' === value[0]) {
        this.props.ceavFilter(value)
        this.props.routeFilter(['-1'])
      } else {
        this.props.routeFilter(value)
        this.props.ceavFilter(['-1'])
      }

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
