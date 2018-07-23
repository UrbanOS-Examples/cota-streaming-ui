import sagas from './route'
import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { ROUTE_FETCH, ROUTE_UPDATE } from '../actions'
import apisauce from 'apisauce'

jest.mock('apisauce')

const reducer = (state = [], action) => {
  return [...state, action]
}

describe('routeSaga', () => {
  let store
  let apisauceGet = jest.fn()
  const fakeRouteResponse = {
    data: {
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
  }

  beforeEach(() => {
    apisauce.create.mockImplementation(() => (
      {
        get: apisauceGet
      }
    ))
    apisauceGet.mockImplementation(() => (
      {
        then: cb => cb(fakeRouteResponse)
      }
    ))

    let sagaMiddleware = createSagaMiddleware()
    store = createStore(reducer, applyMiddleware(sagaMiddleware))
    sagaMiddleware.run(sagas)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('properly attaches the CKAN API on ROUTE_FETCH event', () => {
    store.dispatch({type: ROUTE_FETCH})

    expect(apisauce.create).toHaveBeenCalledWith(
      {
        baseURL: 'https://ckan.smartcolumbusos.com'
      }
    )
  })

  it('queries the CKAN static route data based on ROUTE_FETCH event', () => {
    store.dispatch({type: ROUTE_FETCH})

    expect(apisauceGet).toHaveBeenCalledWith(
      '/api/action/datastore_search_sql',
      {
        sql: 'select distinct "LINENAME", "LINENUM" from "2a329570-33d7-4cde-818d-6ef323e68875" order by "LINENUM"'
      }
    )
  })

  it('dispatches a ROUTE_UPDATE event based on ROUTE_FETCH event', () => {
    store.dispatch({type: ROUTE_FETCH})

    expect(store.getState()).toContainEqual({
      type: ROUTE_UPDATE,
      update: fakeRouteResponse.data
    })
  })
})
