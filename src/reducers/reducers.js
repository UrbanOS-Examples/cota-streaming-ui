import { combineReducers } from 'redux'
import { POSITION_UPDATE, ROUTE_FILTER, CEAV_FILTER, ROUTE_UPDATE } from '../actions'

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
    // case 'CEAV_FILTER'://TODO: CHANGE TO CONSTANT
    //   let vehicle1 = action.update.vehicle
    //     let value1 = {
    //       vehicleId: vehicle1.vehicle.id,
    //       routeId: vehicle1.trip.route_id,
    //       latitude: vehicle1.position.latitude,
    //       longitude: vehicle1.position.longitude,
    //       bearing: vehicle1.position.bearing || 0,
    //       timestamp: vehicle1.timestamp * 1000,
    //       provider: vehicle1.provider
    //     }

    //   return Object.assign({}, data, {[value.vehicleId]: value1})
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
      routesToUse.push({value: '999', label: 'CEAV Shuttle', provider: 'CEAV'})
      return routesToUse;
    default:
      return routes
  }
}

export default combineReducers({
  filter,
  data,
  routes
})
