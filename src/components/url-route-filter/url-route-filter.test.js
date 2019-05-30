import React from 'react'
import UrlRouteFilter from './url-route-filter'
import { shallow } from 'enzyme'
import ReactGA from 'react-ga'

jest.mock('react-ga', () => ({
  event: jest.fn()
}))

describe('UrlRouteFilter', () => {
  let subject, applyStreamFilterStub, fetchAvailableRoutesStub, fakeAvailableRoutes, historyPushStub

  beforeEach(() => {
    fakeAvailableRoutes = [
      { value: 'whatever', label: 'a label' },
      { value: '101', label: 'CMAX' },
      { value: '2', label: 'second route' }
    ]

    ReactGA.event.mockClear()

    applyStreamFilterStub = jest.fn()
    fetchAvailableRoutesStub = jest.fn()
    historyPushStub = jest.fn()
  })

  describe('when user types in valid route id in url and it is different than states selected route', () => {
    beforeEach(() => {
      subject = createSubject({ selectedRouteId: '101', urlRouteId: '101' })
      subject.setProps({ match: { params: { routeId: '2' } } })
    })

    it('updates state to url param', () => {
      expect(applyStreamFilterStub).toBeCalledWith(['2'])
    })

    it('updates state exactly once', () => {
      expect(applyStreamFilterStub).toHaveBeenCalledTimes(1)
    })
  })

  describe('when user types in valid route id in url and it is the same as states selected route', () => {
    beforeEach(() => {
      subject = createSubject({ selectedRouteId: '101', urlRouteId: '101' })
      subject.setProps({ match: { params: { routeId: '101' } } })
    })

    it('does not update state', () => {
      expect(applyStreamFilterStub).toHaveBeenCalledTimes(0)
    })
  })

  describe('when user types in invalid route id in url', () => {
    beforeEach(() => {
      subject = createSubject({ selectedRouteId: '2', urlRouteId: '2' })
      subject.setProps({ match: { params: { routeId: 'CEAVY' } } })
    })

    it('updates state to url param', () => {
      expect(applyStreamFilterStub).toBeCalledWith(['101'])
    })

    it('updates state exactly once', () => {
      expect(applyStreamFilterStub).toHaveBeenCalledTimes(1)
    })

    it('updates url to reflect default', () => {
      expect(historyPushStub).toBeCalledWith('101')
    })

    it('updates url exactly once', () => {
      expect(historyPushStub).toHaveBeenCalledTimes(1)
    })
  })

  describe('url is somehow on an invalid route and user types in a valid one', () => {
    beforeEach(() => {
      subject = createSubject({ selectedRouteId: undefined, urlRouteId: undefined })
      subject.setProps({ match: { params: { routeId: '2' } } })
    })

    it('updates state to url param', () => {
      expect(applyStreamFilterStub).toBeCalledWith(['2'])
    })

    it('updates state exactly once', () => {
      expect(applyStreamFilterStub).toHaveBeenCalledTimes(1)
    })
  })

  describe('url and state are somehow out of sync already and url is updated', () => {
    beforeEach(() => {
      subject = createSubject({ selectedRouteId: undefined, urlRouteId: '101' })
      subject.setProps({ match: { params: { routeId: '2' } } })
    })

    it('updates state to url param', () => {
      expect(applyStreamFilterStub).toBeCalledWith(['2'])
    })

    it('updates state exactly once', () => {
      expect(applyStreamFilterStub).toHaveBeenCalledTimes(1)
    })
  })

  describe('url has valid route and selectedRouteId is updated', () => {
    beforeEach(() => {
      subject = createSubject({ selectedRouteId: '2', urlRouteId: '2' })
      subject.setProps({ selectedRouteId: '101' })
    })

    it('updates url to match state', () => {
      expect(historyPushStub).toBeCalledWith('101')
    })

    it('updates url exactly once', () => {
      expect(historyPushStub).toHaveBeenCalledTimes(1)
    })
  })

  describe('url has valid route and selectedRouteId is set (but not updated)', () => {
    beforeEach(() => {
      subject = createSubject({ selectedRouteId: '2', urlRouteId: '2' })
      subject.setProps({ selectedRouteId: '2' })
    })

    it('does not update url', () => {
      expect(historyPushStub).toHaveBeenCalledTimes(0)
    })
  })

  describe('url is somehow on an invalid route and selectedRouteId is updated', () => {
    beforeEach(() => {
      subject = createSubject({ selectedRouteId: undefined, urlRouteId: undefined })
      subject.setProps({ selectedRouteId: '2' })
    })

    it('updates state to default url param', () => {
      expect(applyStreamFilterStub).toBeCalledWith(['101'])
    })

    it('updates state exactly once', () => {
      expect(applyStreamFilterStub).toHaveBeenCalledTimes(1)
    })

    it('updates url to reflect default', () => {
      expect(historyPushStub).toBeCalledWith('101')
    })

    it('updates url exactly once', () => {
      expect(historyPushStub).toHaveBeenCalledTimes(1)
    })
  })

  describe('url and state are somehow out of sync already and state is updated', () => {
    beforeEach(() => {
      subject = createSubject({ selectedRouteId: undefined, urlRouteId: '101' })
      subject.setProps({ selectedRouteId: '2' })
    })

    it('updates url to match state', () => {
      expect(historyPushStub).toBeCalledWith('2')
    })

    it('updates url exactly once', () => {
      expect(historyPushStub).toHaveBeenCalledTimes(1)
    })
  })

  const createSubject = ({ selectedRouteId, urlRouteId }) => {
    return shallow(
      <UrlRouteFilter
        selectedRouteId={selectedRouteId}
        applyStreamFilter={applyStreamFilterStub}
        fetchAvailableRoutes={fetchAvailableRoutesStub}
        availableRoutes={fakeAvailableRoutes}
        history={{ push: historyPushStub }}
        match={{ params: { routeId: urlRouteId } }
        }
      />
    )
  }
})
