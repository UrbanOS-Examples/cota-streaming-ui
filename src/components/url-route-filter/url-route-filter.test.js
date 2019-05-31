import React from 'react'
import UrlRouteFilter from './url-route-filter'
import { mount } from 'enzyme'
import ReactGA from 'react-ga'

describe('UrlRouteFilter', () => {
  let subject, applyStreamFilterStub, fetchAvailableRoutesStub, fakeAvailableRoutes, historyPushStub

  beforeEach(() => {
    fakeAvailableRoutes = [
      { value: 'whatever', label: 'a label' },
      { value: '101', label: 'CMAX' },
      { value: '2', label: 'second route' }
    ]

    applyStreamFilterStub = jest.fn()
    fetchAvailableRoutesStub = jest.fn()
    historyPushStub = jest.fn()
  })

  describe('when component initially has the same route id as the backend route id', () => {
    beforeEach(() => {
      subject = createSubject({ selectedRouteId: '101', urlRouteId: '101' })
    })

    it('does not update state', () => {
      expect(applyStreamFilterStub).toHaveBeenCalledTimes(0)
    })

    it('does not update url', () => {
      expect(historyPushStub).toHaveBeenCalledTimes(0)
    })

    describe('then the url is updated to a valid route', () => {
      beforeEach(() => {
        subject.setProps({ match: { params: { routeId: '2' } } })
      })

      it('updates state to url param', () => {
        expect(applyStreamFilterStub).toBeCalledWith(['2'])
      })

      it('updates state exactly once', () => {
        expect(applyStreamFilterStub).toHaveBeenCalledTimes(1)
      })

      it('does not update url', () => {
        expect(historyPushStub).toHaveBeenCalledTimes(0)
      })
    })

    describe('then the url is updated to an invalid route', () => {
      beforeEach(() => {
        subject.setProps({ match: { params: { routeId: 'AAA' } } })
      })

      it('updates state to default id', () => {
        expect(applyStreamFilterStub).toBeCalledWith(['101'])
      })

      it('updates url to reflect default', () => {
        expect(historyPushStub).toBeCalledWith('101')
      })

      it('updates state exactly once', () => {
        expect(applyStreamFilterStub).toHaveBeenCalledTimes(1)
      })

      it('updates url exactly once', () => {
        expect(historyPushStub).toHaveBeenCalledTimes(1)
      })
    })

    describe('then the state is updated to a route', () => {
      beforeEach(() => {
        subject.setProps({ selectedRouteId: '2' })
      })

      it('updates url to state id', () => {
        expect(historyPushStub).toBeCalledWith('2')
      })

      it('updates url exactly once', () => {
        expect(historyPushStub).toHaveBeenCalledTimes(1)
      })

      it('does not update state', () => {
        expect(applyStreamFilterStub).toHaveBeenCalledTimes(0)
      })
    })
  })

  describe('when component initially has a differenet route id than the backend route id', () => {
    beforeEach(() => {
      subject = createSubject({ selectedRouteId: '101', urlRouteId: '2' })
    })

    it('updates url to match state', () => {
      expect(historyPushStub).toBeCalledWith('101')
    })

    it('updates url exactly once', () => {
      expect(historyPushStub).toHaveBeenCalledTimes(1)
    })

    it('update to url occurs after state update', () => {
      expect(historyPushStub).toHaveBeenCalledAfter(applyStreamFilterStub)
    })
  })

  describe('when component initially has an invalid url route id', () => {
    beforeEach(() => {
      subject = createSubject({ selectedRouteId: '2', urlRouteId: 'AAAAA' })
    })

    it('updates state to default id', () => {
      expect(applyStreamFilterStub).toBeCalledWith(['101'])
    })

    it('updates url to reflect default', () => {
      expect(historyPushStub).toBeCalledWith('101')
    })
  })

  describe('when component initially has the same state and url, but no routes are available', () => {
    beforeEach(() => {
      subject = createSubject({ selectedRouteId: '2', urlRouteId: '2', availableRoutes: [] })
    })

    it('does not update state', () => {
      expect(applyStreamFilterStub).toHaveBeenCalledTimes(0)
    })

    it('does not update url', () => {
      expect(historyPushStub).toHaveBeenCalledTimes(0)
    })
  })

  describe('when component initially has different state and url (invalid), but no routes are available', () => {
    beforeEach(() => {
      subject = createSubject({ selectedRouteId: '2', urlRouteId: 'AAA', availableRoutes: [] })
    })

    it('does not update url to the default', () => {
      expect(historyPushStub).not.toBeCalledWith('101')
    })

    describe('then it eventually gets some routes', () => {
      beforeEach(() => {
        subject.setProps({ availableRoutes: fakeAvailableRoutes })
      })

      it('updates the url to reflect the default', () => {
        expect(historyPushStub).toBeCalledWith('101')
      })

      it('updates the state to reflect the default', () => {
        expect(applyStreamFilterStub).toBeCalledWith(['101'])
      })
    })
  })

  describe('when component initially has different state and url (valid), but no routes are available', () => {
    beforeEach(() => {
      subject = createSubject({ selectedRouteId: '2', urlRouteId: '101', availableRoutes: [] })
    })

    it('does not update url to the default', () => {
      expect(historyPushStub).not.toBeCalledWith('101')
    })

    describe('then it eventually gets some routes', () => {
      beforeEach(() => {
        subject.setProps({ availableRoutes: fakeAvailableRoutes })
      })

      it('updates the state to reflect the url', () => {
        expect(applyStreamFilterStub).toBeCalledWith(['101'])
      })
    })
  })

  const createSubject = ({ selectedRouteId, urlRouteId, availableRoutes = fakeAvailableRoutes }) => {
    return mount(
      <UrlRouteFilter
        selectedRouteId={selectedRouteId}
        applyStreamFilter={applyStreamFilterStub}
        fetchAvailableRoutes={fetchAvailableRoutesStub}
        availableRoutes={availableRoutes}
        history={{ push: historyPushStub }}
        match={{ params: { routeId: urlRouteId } }}
      />
    )
  }
})