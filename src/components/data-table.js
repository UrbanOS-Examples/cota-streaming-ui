import React, { Component } from 'react'

class DataTable extends Component {

  render () {
      console.log(this.props)
    return (
      <div className='data-table'>
        {this.props.tableData}
      </div>
    )
  }
}

export default DataTable
