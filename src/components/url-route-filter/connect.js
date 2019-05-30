import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { applyStreamFilter, fetchAvailableRoutes } from '../../actions'
import UrlRouteFilter from './url-route-filter'
import _ from 'lodash'

const mapStateToProps = state => ({
  availableRoutes: state.availableRoutes,
  selectedRouteId: _.first(state.filter)
})

const mapDispatchToProps = dispatch => bindActionCreators({ applyStreamFilter, fetchAvailableRoutes }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(UrlRouteFilter)
