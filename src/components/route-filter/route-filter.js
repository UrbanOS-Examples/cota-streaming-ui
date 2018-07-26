import React from 'react'
import Select from 'react-select'
import _ from 'lodash'
import './route-filter.scss'

export default class extends React.Component {
    state = {
      selectedOption: null
    }

    handleChange = (selectedOption) => {
      this.setState({ selectedOption })

      // component sends either {value:<v>, label:<l>} or [undefined]
      const value = _.flatten([selectedOption])
        .filter(option => !_.isEmpty(option))
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
          options={this.props.routes}
          placeholder='Filter by route...'
        />
      </route-filter>
    }

    componentDidMount = () => {
      this.props.routeFetch()
    }
}
