import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { routeFilter, routeFetch } from '../../actions'
import RouteFilter from './route-filter'

const mapStateToProps = (state) => ({routes: state.routes})

const mapDispatchToProps = dispatch => bindActionCreators({routeFilter, routeFetch}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(RouteFilter)
