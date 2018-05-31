import React from 'react'
import ReactDOM from 'react-dom'
import DataTable from './data-table'
import { shallow } from 'enzyme'

describe('table renders list elements based on props', () => {
    let subject, testData

    beforeEach(() => {
        testData = [
            {
                "vehicleID": "12939",
                "routeID": "152",
                "latitude": 39.998947143555,
                "longitude": -82.885498046875,
                "timestamp": 1527795212
              } 
        ]
        subject= shallow(<DataTable tableData={testData}/>)
    })

    it('creates the right number of list elements', () => {
        expect(subject.find('td')).toHaveLength(2)
    })

    it('populates the list elements with text', () => {
        expect(subject.find('td').first().text()).toEqual(testData[0].vehicleID)
    })
})
