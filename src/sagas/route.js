import { call, takeLatest, put } from 'redux-saga/effects'
import { ROUTE_FETCH, routeUpdate } from '../actions'
import { create } from 'apisauce'

const COTA_LINE_DATA_SET_ID = `"2a329570-33d7-4cde-818d-6ef323e68875"`

const fetchRoutes = function* (action) {
  const api = create({
    baseURL: 'https://data.smartcolumbusos.com/api/v1',
    headers: { 'Accept': 'application/json' }
  })

  const { data } = yield call(
    api.get,
    'organization/central_ohio_transit_authority/dataset/2a329570_33d7_4cde_818d_6ef323e68875/query'
  )

  yield put(routeUpdate(data))
}

export default function* routeSaga() {
  yield takeLatest(ROUTE_FETCH, fetchRoutes)
}
