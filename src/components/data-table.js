import React, { Component } from 'react'
import './data-table.css'

class DataTable extends Component {

  render () {
    const listItems = this.props.tableData.map((message) =>
    <tr><td>{message.vehicleID}</td> <td>{message.routeID}</td></tr>
  )

    return (
      <div className='data-table'>
        <table>
            <thead>
                {listItems}
            </thead>
        </table>
      </div>
    )
  }
}

export default DataTable
