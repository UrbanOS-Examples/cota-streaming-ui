import reducer from './index'
import { POSITION_UPDATE, ROUTE_FILTER, ROUTE_FETCH, ROUTE_UPDATE } from '../actions'

describe('cotaApp reducers', () => {
  it('will save the filter when processing a ROUTE_FILTER action', () => {
    let newState = reducer(undefined, {type: ROUTE_FILTER, filter: ['route1']})
    expect(newState.filter).toEqual(['route1'])
  })

  it('will not modify the filter on a unknown event', () => {
    let newState = reducer({filter: ['yahtzee']}, {type: 'UNKNOWN_ACTION', stuff: []})
    expect(newState.filter).toEqual(['yahtzee'])
  })

  it('will transform the data on a POSITION_UPDATE action', () => {
    let message = {
      'vehicle': {
        'vehicle': {
          'label': '1213',
          'id': '11213'
        },
        'trip': {
          'trip_id': '628095',
          'start_date': '20180628',
          'route_id': '002'
        },
        'timestamp': 1530200139,
        'position': {
          'speed': 0.000006558918357768562,
          'longitude': -82.95664978027344,
          'latitude': 39.95763397216797,
          'bearing': 270
        },
        'current_status': 'IN_TRANSIT_TO'
      },
      'id': '1213'
    }

    let state = {
      '11213': {
        'vehicleId': '11213',
        'routeId': '002',
        'latitude': 39.95763397216797,
        'longitude': -82.95664978027344,
        'bearing': 270,
        'timestamp': 1530200139000
      }
    }

    let newState = reducer(undefined, {type: POSITION_UPDATE, update: message})
    expect(newState.data).toEqual(state)
  })

  it('will transform an empty action into a bearing', () => {
    let message = {
      vehicle: {
        vehicle: {
          id: '1234'
        },
        trip: {},
        position: {},
        timestamp: 0
      }
    }
    let newState = reducer(undefined, {type: POSITION_UPDATE, update: message})
    expect(newState.data['1234'].bearing).toEqual(0)
  })

  it('will not transform the payload on an unknown event', () => {
    let newState = reducer({data: ['yahtzee']}, {type: 'UNKNOWN_ACTION', stuff: []})
    expect(newState.data).toEqual(['yahtzee'])
  })

  it('will remove all data records on register filter action', () => {
    let currentState = {
      filter: {},
      data: {
        '98765': {
          'vehicleId': '98765',
          'routeId': '002',
          'latitude': 39.95763397216797,
          'longitude': -82.95664978027344,
          'bearing': 270,
          'timestamp': 1530200139000
        },
        '11213': {
          'vehicleId': '11213',
          'routeId': '003',
          'latitude': 39.95763397216797,
          'longitude': -82.95664978027344,
          'bearing': 270,
          'timestamp': 1530200139000
        }
      }
    }

    let expectedData = {}

    let newState = reducer(currentState, {type: 'ROUTE_FILTER', filter: ['003']})
    expect(newState.data).toEqual(expectedData)
  })

  it('will transform the data on a ROUTE_UPDATE action', () => {
    let message = {
      'help': 'not necessary',
      'success': true,
      'result': {
        'records': [
          {
            'LINENUM': '1',
            'LINENAME': 'Crazy Town'
          },
          {
            'LINENUM': '101',
            'LINENAME': 'Smallville'
          }
        ]
      }
    }

    let state = [
      {value: '001', label: '1 - Crazy Town', provider: "COTA"},
      {value: '101', label: '101 - Smallville', provider: "COTA"}
    ]

    let newState = reducer(undefined, {type: ROUTE_UPDATE, update: message})
    expect(newState.routes[0]).toEqual(state[0])
    expect(newState.routes[1]).toEqual(state[1])
  })

  it('will append CEAV Smart Circuit on a ROUTE_UPDATE action', () => {
    let message = {
      'help': 'not necessary',
      'success': true,
      'result': {
        'records': [
          {
            'LINENUM': '1',
            'LINENAME': 'Crazy Town'
          },
          {
            'LINENUM': '101',
            'LINENAME': 'Smallville'
          }
        ]
      }
    }

    let newState = reducer(undefined, {type: ROUTE_UPDATE, update: message})
    expect(newState.routes[2]).toEqual({value: 'CEAV', label: 'SMRT - Smart Circuit', provider: 'CEAV'})
  })

  it('will not transform the routes on an unknown event', () => {
    let newState = reducer({routes: [{value: '001', label: '1 - Crazy Town'}]}, {type: 'UNKNOWN_ACTION', stuff: []})
    expect(newState.routes).toEqual([{value: '001', label: '1 - Crazy Town'}])
  })

  it('will should not remove all routes on route fetch action', () => {
    const routes = [
      { value: '001', label: '1 - Crazy Town' },
      { value: '101', label: '101 - Smallville' }
    ]
    let currentState = {
      filter: {},
      data: {},
      routes: routes
    }

    let newState = reducer(currentState, {type: ROUTE_FETCH})
    expect(newState.routes).toEqual(routes)
  })
})
