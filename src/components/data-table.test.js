import React from 'react'
import ReactDOM from 'react-dom'
import DataTable from './data-table'
import { shallow } from 'enzyme'

describe('table renders list elements based on props', () => {
    let subject, testData

    beforeEach(() => {
        testData = ['thing1', 'thing2', 'thing3']
        subject= shallow(<DataTable tableData={testData}/>)
    })

    it('creates the right number of list elements', () => {
        expect(subject.find('li')).toHaveLength(testData.length)
    })

    it('populates the list elements with text', () => {
        expect(subject.find('li').first().text()).toEqual(testData[0])
    })
})
