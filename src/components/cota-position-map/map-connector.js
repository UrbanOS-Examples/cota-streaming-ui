import withWebsocket from '../../higher-order-components/with-cota-websocket'
import Map from './map'

export default withWebsocket(Map, `ws://${window.WEBSOCKET_HOST}/socket`)
