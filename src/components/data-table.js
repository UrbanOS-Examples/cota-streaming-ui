import React, { Component } from 'react'
import './data-table.css'

class DataTable extends Component {
  render () {
    const listItems = this.props.tableData.map((message, index) =>
      <tr key={index}><td>{message.vehicleID}</td><td>{message.routeID}</td>
        <td>{message.latitude}</td><td>{message.longitude}</td><td>{message.timestamp}</td><td>Very</td></tr>
    )
    return (
      <div className='data-table'>
        <table>
          <thead>
            <tr>
              <th scope='col'>Vehicle ID</th>
              <th scope='col'>Route ID</th>
              <th scope='col'>Latitude</th>
              <th scope='col'>Longitude</th>
              <th scope='col'>Timestamp</th>
              <th scope='col'>How cool Erin is</th>
            </tr>
          </thead>
          <tbody>
            {listItems}
          </tbody>
        </table>
      </div>
    )
  }
}

export default DataTable
