import { connect } from 'react-redux'
import Map from './map'

const mapStateToProps = state => {
  return {
    data: Object.values(state.data)
  }
}

export default connect(mapStateToProps)(Map)
