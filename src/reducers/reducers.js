import { combineReducers } from 'redux'
import { POSITION_UPDATE, ROUTE_FILTER, CEAV_UPDATE, ROUTE_UPDATE } from '../actions'
import { CEAV, COTA } from '../variables'

const filter = (filter = [], action) => {
  switch (action.type) {
    case ROUTE_FILTER:
      return action.filter
    default:
      return filter
  }
}

const provider = (provider = { name: COTA }, action) => {
  switch (action.type) {
    case ROUTE_FILTER:
      if (CEAV === action.filter[0]) {
        return Object.assign({}, provider, { name: CEAV })
      }
      return Object.assign({}, provider, { name: COTA })
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

      return Object.assign({}, data, { [value.vehicleId]: value })
    case CEAV_UPDATE:
      let ceavVehicle = action.update
      let busToPutOnMap = {
        vehicleId: ceavVehicle.vehicle_id,
        latitude: ceavVehicle.latitude,
        longitude: ceavVehicle.longitude,
        timestamp: ceavVehicle.update_time,
        provider: ceavVehicle.provider,
        bearing: 0
      }

      return Object.assign({}, data, { [busToPutOnMap.vehicleId]: busToPutOnMap })
    case ROUTE_FILTER:
      return {}
    default:
      return data
  }
}

const availableRoutes = (availableRoutes = [], action) => {
  switch (action.type) {
    case ROUTE_UPDATE:
      let routesToUse = action.update.result.records.map((route) => {
        const lineNumber = route.LINENUM.padStart(3, '0')
        const lineName = `${route.LINENUM} - ${route.LINENAME}`
        return { value: lineNumber, label: lineName, provider: 'COTA' }
      })
      routesToUse.push({ value: CEAV, label: 'SMRT - Smart Circuit', provider: CEAV })
      return routesToUse
    default:
      return availableRoutes
  }
}

export default combineReducers({
  filter,
  data,
  availableRoutes,
  provider
})
