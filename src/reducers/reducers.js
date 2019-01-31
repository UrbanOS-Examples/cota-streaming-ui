import { combineReducers } from 'redux'
import { POSITION_UPDATE, ROUTE_FILTER, CEAV_FILTER, CEAV_UPDATE, ROUTE_UPDATE } from '../actions'

const CMAX_LINE_NUMBER = '101'

const filter = (filter = [CMAX_LINE_NUMBER], action) => {
  switch (action.type) {
    case ROUTE_FILTER:
      return action.filter
    case CEAV_FILTER:
      return action.filter
    default:
      return filter
  }
}

const provider = (provider = {name: "COTA"}, action) => {
  switch (action.type) {
    case ROUTE_FILTER:
      if("CEAV" === action.filter[0]) {
        return Object.assign({}, provider, {name: "CEAV"})
      }
      return Object.assign({}, provider, {name: "COTA"})
    default:
      return provider
  }
}

const data = (data = {}, action) => {
  switch (action.type) {
    case POSITION_UPDATE:
      let vehicle = action.update.vehicle
      let value = {
        vehicleId: vehicle.vehicle.id,
        routeId: vehicle.trip.route_id,
        latitude: vehicle.position.latitude,
        longitude: vehicle.position.longitude,
        bearing: vehicle.position.bearing || 0,
        timestamp: vehicle.timestamp * 1000,
        provider: vehicle.provider
      }

      return Object.assign({}, data, {[value.vehicleId]: value})
    case CEAV_UPDATE:
      let vehicle1 = action.update.vehicle
        let value1 = {
          vehicleId: vehicle1.vehicle.id,
          routeId: vehicle1.trip.route_id,
          latitude: vehicle1.position.latitude,
          longitude: vehicle1.position.longitude,
          bearing: vehicle1.position.bearing || 0,
          timestamp: vehicle1.timestamp * 1000,
          provider: vehicle1.provider
        }

      return Object.assign({}, data, {[value1.vehicleId]: value1})
    case ROUTE_FILTER:
      return {}
    case CEAV_FILTER:
      return {}
    default:
      return data
  }
}

const routes = (routes = [], action) => {
  switch (action.type) {
    case ROUTE_UPDATE:
      let routesToUse = action.update.result.records.map((route) => {
        const lineNumber = route.LINENUM.padStart(3, '0')
        const lineName = `${route.LINENUM} - ${route.LINENAME}`
        return {value: lineNumber, label: lineName, provider: 'COTA'}
      })
      routesToUse.push({value: 'CEAV', label: 'CEAV Shuttle', provider: 'CEAV'})
      return routesToUse;
    default:
      return routes
  }
}

export default combineReducers({
  filter,
  data,
  routes,
  provider
})
