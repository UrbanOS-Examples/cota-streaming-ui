
export const POSITION_UPDATE = 'POSITION_UPDATE'

export const ROUTE_FILTER = 'ROUTE_FILTER'

export const positionUpdate = (message) => {
  return { type: POSITION_UPDATE, update: message }
}

export const routeFilter = (filter) => {
  return { type: ROUTE_FILTER, filter: filter }
}
