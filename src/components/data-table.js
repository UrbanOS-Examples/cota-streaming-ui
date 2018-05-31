import React, { Component } from 'react'
import './data-table.css'

class DataTable extends Component {

  render () {
    const listItems = this.props.tableData.map((message) =>
    <li key={Math.floor((Math.random() * 1000000))}>{message}</li>
  )

    console.log(listItems)
    return (
      <div className='data-table'>
        <ul>
            {listItems}
        </ul>
      </div>
    )
  }
}

export default DataTable
