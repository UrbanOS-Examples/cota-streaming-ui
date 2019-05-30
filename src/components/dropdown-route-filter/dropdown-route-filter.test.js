import React from 'react'
import DropdownRouteFilter from './dropdown-route-filter'
import { shallow } from 'enzyme'
import ReactGA from 'react-ga'

jest.mock('react-ga', () => ({
  event: jest.fn()
}))

describe('DropdownRouteFilter', () => {
  let subject, applyStreamFilterStub, fetchAvailableRoutesStub, dropdown, fakeRoutes

  beforeEach(() => {
    fakeRoutes = [{ value: 'some cool route', label: 'a label' }, { value: '2', label: 'second route' }]

    ReactGA.event.mockClear()

    applyStreamFilterStub = jest.fn()
    fetchAvailableRoutesStub = jest.fn()
    subject = shallow(<DropdownRouteFilter selectedRouteId={fakeRoutes[0].value}
      applyStreamFilter={applyStreamFilterStub}
      fetchAvailableRoutes={fetchAvailableRoutesStub}
      availableRoutes={fakeRoutes} />)
    dropdown = subject.find('[id="routeSelect"]')
  })

  it('uses the route id passed in to determine it\'s value', () => {
    expect(dropdown.props().value).toEqual(fakeRoutes[0])
  })

  it('passes the selected value to its route filter function', () => {
    dropdown.simulate('change', { value: '001', label: 'whonko' })

    expect(applyStreamFilterStub).toBeCalledWith(['001'])
  })

  it('passes an empty list to its route filter when given a change with no value (signal to clear selection)', () => {
    dropdown.simulate('change', { label: 'Timmay!' })

    expect(applyStreamFilterStub).toBeCalledWith([])
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
