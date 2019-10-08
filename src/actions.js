
export const POSITION_UPDATE = 'POSITION_UPDATE'

export const ROUTE_FILTER = 'ROUTE_FILTER'

export const ROUTE_FETCH = 'ROUTE_FETCH'

export const ROUTE_UPDATE = 'ROUTE_UPDATE'

export const positionUpdate = (message) => {
  return { type: POSITION_UPDATE, update: message }
}

export const applyStreamFilter = (filter) => {
  return { type: ROUTE_FILTER, filter: filter }
}

export const fetchAvailableRoutes = () => {
  return { type: ROUTE_FETCH }
}

export const routeUpdate = (message) => {
  return { type: ROUTE_UPDATE, update: message }
}
