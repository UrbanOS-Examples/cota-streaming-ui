import React from 'react'
import Select from 'react-select'
import _ from 'lodash'
import './route-filter.scss'

export default class extends React.Component {
  constructor (props) {
    super(props)
    this.ALL_ROUTES = [{ label: 'Filter by lines...', value: '' }]
    this.state = { selectedOption: this.ALL_ROUTES }
  }

  componentDidMount = () => {
    this.props.routeFetch()
  }

  handleChange = selectedOption => {
    this.setState({ selectedOption })

    const value = _.flatten([selectedOption])
      .filter(option => !_.isEmpty(option.value))
      .map(option => option.value)

    this.props.routeFilter(value)
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
