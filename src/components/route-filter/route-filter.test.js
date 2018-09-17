import React from 'react'
import RouteFilter from './route-filter'
import { shallow } from 'enzyme'

describe('RouteFilter', () => {
  it('passes the selected value to its route filter function', () => {
    const routeFilterStub = jest.fn()
    const subject = shallow(<RouteFilter routeFilter={routeFilterStub} routeFetch={jest.fn()} />)

    const dropdown = subject.find('[id="routeSelect"]')
    dropdown.simulate('change', {value: '001', label: 'whonko'})

    expect(routeFilterStub).toBeCalledWith(['001'])
  })

  it('passes an empty list to its route filter when given a change with no value (signal to clear selection)', () => {
    const routeFilterStub = jest.fn()
    const subject = shallow(<RouteFilter routeFilter={routeFilterStub} routeFetch={jest.fn()} />)

    const dropdown = subject.find('[id="routeSelect"]')
    dropdown.simulate('change', { label: 'Timmay!' })

    expect(routeFilterStub).toBeCalledWith([])
  })

  it('properly concatenates the routes', () => {
    const fakeRoutes = [{value: 'some cool route', label: 'a label'}]
    const testAllRoutes = [{ label: 'Filter by lines...' }]

    const subject = shallow(<RouteFilter routes={fakeRoutes} routeFetch={jest.fn()} />)

    expect(subject.find('[id="routeSelect"]').props().options).toEqual(testAllRoutes.concat(fakeRoutes))
  })
})
