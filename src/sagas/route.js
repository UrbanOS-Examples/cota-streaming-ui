import { call, takeLatest, put } from 'redux-saga/effects'
import { ROUTE_FETCH, routeUpdate } from '../actions'
import { create } from 'apisauce'

const COTA_LINE_DATA_SET_ID = `"2a329570-33d7-4cde-818d-6ef323e68875"`

const fetchRoutes = function* (action) {
  const api = create({
    baseURL: 'https://ckan.smartcolumbusos.com'
  })

  const { data } = yield call(
    api.get,
    '/api/action/datastore_search_sql',
    {
      sql: `select distinct "LINENAME", "LINENUM" from ${COTA_LINE_DATA_SET_ID} order by "LINENUM"`
    }
  )

  yield put(routeUpdate(data))
}

export default function* routeSaga() {
  yield takeLatest(ROUTE_FETCH, fetchRoutes)
}
