import React from 'react'
import _ from 'lodash'

export default class extends React.Component {
  componentDidMount = () => {
    this.props.fetchAvailableRoutes()
  }

  updateUrl = (id) => {
    return this.props.history.push(id)
  }

  updateState = (id) => {
    return this.props.applyStreamFilter([id])
  }

  routeIsValid = (id) => {
    return _.find(this.props.availableRoutes, { value: id }) === undefined
  }

  componentDidUpdate = (previousProps) => {
    const { selectedRouteId, defaultRouteId, match: { params: { routeId: urlRouteId } } } = this.props

    const stateAndUrlOutOfSync = selectedRouteId !== urlRouteId
    const stateWasUpdated = selectedRouteId !== previousProps.selectedRouteId

    if (this.routeIsValid(urlRouteId)) {
      this.updateState(defaultRouteId)
      return this.updateUrl(defaultRouteId)
    }
    if (stateAndUrlOutOfSync) {
      if (stateWasUpdated) {
        return this.updateUrl(selectedRouteId)
      } else {
        return this.updateState(urlRouteId)
      }
    }
  }

  render = () => {
    return <url-route-filter />
  }
}