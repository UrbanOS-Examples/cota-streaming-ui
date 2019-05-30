import React, { useEffect } from 'react'
import _ from 'lodash'

const CMAX_LINE_NUMBER = '101'

export default (props) => {
  const { selectedRouteId, availableRoutes, history, match: { params: { routeId: urlRouteId } } } = props

  const routeIsNotValid = (id) => {
    return _.find(availableRoutes, { value: id }) === undefined
  }

  const handleInitialize = () => {
    props.fetchAvailableRoutes()
  }

  const handleUrlUpdate = () => {
    if (routeIsNotValid(urlRouteId)) {
      props.applyStreamFilter([CMAX_LINE_NUMBER])
      history.push(CMAX_LINE_NUMBER)
    } else {
      props.applyStreamFilter([urlRouteId])
    }
  }

  const handleFilterUpdate = () => {
    history.push(selectedRouteId)
  }

  useEffect(handleInitialize, [])
  useEffect(handleUrlUpdate, [urlRouteId, availableRoutes])
  useEffect(handleFilterUpdate, [selectedRouteId])

  return null
}
