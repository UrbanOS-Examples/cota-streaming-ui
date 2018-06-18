import withWebsocket from '../../higher-order-components/with-websocket'
import DataTable from './data-table'

export default withWebsocket(DataTable, `ws://${window.WEBSOCKET_HOST}/socket`)
