import React from 'react'
import RouteFilter from './route-filter'
import { shallow } from 'enzyme'
import ReactGA from 'react-ga'

jest.mock('react-ga', () => ({
  event: jest.fn()
}))

describe('RouteFilter', () => {
  let subject, routeFilterStub, routeFetchStub, dropdown

  beforeEach(() => {
    ReactGA.event.mockClear()

    routeFilterStub = jest.fn()
    routeFetchStub = jest.fn()
    subject = shallow(<RouteFilter routeFilter={routeFilterStub} routeFetch={routeFetchStub} />)
    dropdown = subject.find('[id="routeSelect"]')
  })

  it('passes the selected value to its route filter function', () => {
    dropdown.simulate('change', {value: '001', label: 'whonko'})

    expect(routeFilterStub).toBeCalledWith(['001'])
  })

  it('passes an empty list to its route filter when given a change with no value (signal to clear selection)', () => {
    dropdown.simulate('change', { label: 'Timmay!' })

    expect(routeFilterStub).toBeCalledWith([])
  })

  it('properly concatenates the routes', () => {
    const fakeRoutes = [{value: 'some cool route', label: 'a label'}]
    const testAllRoutes = [{ label: 'Filter by lines...' }]

    subject = shallow(<RouteFilter routes={fakeRoutes} routeFetch={routeFetchStub} />)

    expect(subject.find('[id="routeSelect"]').props().options).toEqual(testAllRoutes.concat(fakeRoutes))
  })

  describe('Google Analytics', () => {
    it('selecting an item should register google analytics event', () => {
      dropdown.simulate('change', { label: '01 - KENNY/LIVINGSTON' })

      expect(ReactGA.event).toBeCalledWith({
        category: 'Navigation',
        action: 'Route Selected',
        label: '01 - KENNY/LIVINGSTON'
      })
    })
  })
})
