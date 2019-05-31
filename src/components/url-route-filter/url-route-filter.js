import React, { useEffect } from 'react'
import _ from 'lodash'

const CMAX_LINE_NUMBER = '101'

export default (props) => {
  const { selectedRouteId, availableRoutes, history, match: { params: { routeId: urlRouteId } } } = props

  const routeIdsAreInSync = selectedRouteId === urlRouteId
  const routesAreAvailable = !_.isEmpty(availableRoutes)

  const routeIsValid = (id) => {
    return _.find(availableRoutes, { value: id }) !== undefined
  }

  const shouldApplyDefaults = (id) => {
    return routesAreAvailable && !routeIsValid(id)
  }
  const shouldApplyUrlChanges = (id) => {
    return routesAreAvailable && !routeIdsAreInSync
  }
  const shouldApplyStateChanges = (_id) => {
    return !routeIdsAreInSync
  }

  const handleInitialize = () => {
    props.fetchAvailableRoutes()
  }

  const handleUrlUpdate = () => {
    if (shouldApplyDefaults(urlRouteId)) {
      props.applyStreamFilter([CMAX_LINE_NUMBER])
      history.push(CMAX_LINE_NUMBER)
    } else if (shouldApplyUrlChanges(urlRouteId)) {
      props.applyStreamFilter([urlRouteId])
    }
  }

  const handleFilterUpdate = () => {
    if (shouldApplyStateChanges(selectedRouteId)) history.push(selectedRouteId)
  }

  useEffect(handleInitialize, [])
  useEffect(handleUrlUpdate, [urlRouteId, availableRoutes])
  useEffect(handleFilterUpdate, [selectedRouteId])

  return null
}
