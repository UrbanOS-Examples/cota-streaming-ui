import { combineReducers } from 'redux'
import { POSITION_UPDATE, ROUTE_FILTER } from '../actions'

const filter = (filter = [], action) => {
  switch (action.type) {
    case ROUTE_FILTER:
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
        timestamp: vehicle.timestamp * 1000
      }

      return Object.assign({}, data, {[value.vehicleId]: value})
    case ROUTE_FILTER:
      return {}
    default:
      return data
  }
}

export default combineReducers({
  filter,
  data
})
