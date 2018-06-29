import React from 'react'
import RouteFilter from './route-filter'
import { shallow } from 'enzyme'

describe('RouteFilter', () => {
  it('passes the input box value to its route filter function', () => {
    const routeFilterStub = jest.fn()
    const subject = shallow(<RouteFilter routeFilter={routeFilterStub} />)

    const inputBox = subject.find('input')
    inputBox.simulate('keyup', {key: 'Enter', target: {value: 'whonko'}})

    expect(routeFilterStub).toBeCalledWith(['whonko'])
  })

  it('passes an empty list to its router filter function when input value is empty string', () => {
    const routeFilterStub = jest.fn()
    const subject = shallow(<RouteFilter routeFilter={routeFilterStub} />)

    const inputBox = subject.find('input')
    inputBox.simulate('keyup', {key: 'Enter', target: {value: ''}})

    expect(routeFilterStub).toBeCalledWith([])
  })
})
