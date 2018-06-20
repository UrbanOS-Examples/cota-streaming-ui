import React from 'react'
import moment from 'moment'
import './data-table.scss'

function createListItem (message, index) {
  return (
    <tr key={`table-${message.vehicleId}-${index}`}>
      <td className='vehicle-id'>{message.vehicleId}</td>
      <td className='route-id'>{message.routeId}</td>
      <td className='latitude'>{message.latitude}</td>
      <td className='longitude'>{message.longitude}</td>
      <td className='timestamp'>{moment(message.timestamp).toISOString()}</td>
    </tr>
  )
}

export default ({ data }) => (
  <data-table>
    <table>
      <thead>
        <tr>
          <th scope='col'>Vehicle ID</th>
          <th scope='col'>Route ID</th>
          <th scope='col'>Latitude</th>
          <th scope='col'>Longitude</th>
          <th scope='col'>Timestamp</th>
        </tr>
      </thead>
      <tbody>
        {data.map(createListItem)}
      </tbody>
    </table>
  </data-table>
)
