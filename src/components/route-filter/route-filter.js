import React from 'react'
import Select from 'react-select'
import _ from 'lodash'
import './route-filter.scss'
import ReactGA from 'react-ga';

export default class extends React.Component {
  constructor (props) {
    super(props)
    this.ALL_ROUTES = [{ label: 'Filter by lines...' }]
    this.state = { selectedOption: this.ALL_ROUTES }
  }

  componentDidMount = () => {
    this.props.routeFetch()
  }

  handleChange = selectedOption => {
    this.setState({ selectedOption })

    const value = _.flatten([selectedOption])
      .map(option => option.value)
      .filter(option => option)

    this.props.routeFilter(value)

    ReactGA.event({
      category: 'Navigation',
      action: 'Route Selected',
      label: selectedOption.label
    });
  }

  render = () => {
    const { selectedOption } = this.state

    return <route-filter>
      <Select
        id='routeSelect'
        value={selectedOption}
        onChange={this.handleChange}
        options={this.ALL_ROUTES.concat(this.props.routes)}
        placeholder='Filter by lines...'
        backspaceRemovesValue={false}
      />
    </route-filter>
  }
}