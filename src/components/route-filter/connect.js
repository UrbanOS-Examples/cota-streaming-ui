import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { routeFilter, routeFetch, ceavFilter } from '../../actions'
import RouteFilter from './route-filter'
import _ from 'lodash'

const mapStateToProps = state => ({
  routes: state.routes,
  selectedRouteId: _.first(state.filter)
})

const mapDispatchToProps = dispatch => bindActionCreators({routeFilter, routeFetch, ceavFilter}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(RouteFilter)
