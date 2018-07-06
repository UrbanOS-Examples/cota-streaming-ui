import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { routeFilter } from '../../actions'
import RouteFilter from './route-filter'

const mapStateToProps = state => ({})

const mapDispatchToProps = dispatch => bindActionCreators({routeFilter}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(RouteFilter)
