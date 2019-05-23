import React from 'react'
import UrlRouteFilter from './url-route-filter'
import { mount } from 'enzyme'
import ReactGA from 'react-ga'

jest.mock('react-ga', () => ({
    event: jest.fn()
}))

describe('UrlRouteFilter', () => {
    let subject, applyStreamFilterStub, fetchAvailableRoutesStub, fakeAvailableRoutes, historyPushStub
    const defaultRouteId = "DEFAULT"

    beforeEach(() => {
        fakeAvailableRoutes = [
            { value: defaultRouteId, label: 'a label' },
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
            subject = mount(
                <UrlRouteFilter
                    selectedRouteId={"101"}
                    defaultRouteId={defaultRouteId}
                    applyStreamFilter={applyStreamFilterStub}
                    fetchAvailableRoutes={fetchAvailableRoutesStub}
                    availableRoutes={fakeAvailableRoutes}
                    history={{ push: historyPushStub }}
                    match={{ params: { routeId: "101" } }}
                />
            )
            subject.setProps({ match: { params: { routeId: "2" } } })
        })

        it('updates state to url param', () => {
            expect(applyStreamFilterStub).toBeCalledWith(["2"])
        })

        it('updates state exactly once', () => {
            expect(applyStreamFilterStub).toHaveBeenCalledTimes(1)
        })
    })

    describe('when user types in valid route id in url and it is the same as states selected route', () => {
        beforeEach(() => {
            subject = mount(
                <UrlRouteFilter
                    selectedRouteId={"101"}
                    defaultRouteId={defaultRouteId}
                    applyStreamFilter={applyStreamFilterStub}
                    fetchAvailableRoutes={fetchAvailableRoutesStub}
                    availableRoutes={fakeAvailableRoutes}
                    history={{ push: historyPushStub }}
                    match={{ params: { routeId: "101" } }}
                />
            )
            subject.setProps({ match: { params: { routeId: "101" } } })
        })

        it('does not update state', () => {
            expect(applyStreamFilterStub).toHaveBeenCalledTimes(0)
        })
    })

    describe('when user types in invalid route id in url', () => {
        beforeEach(() => {
            subject = mount(
                <UrlRouteFilter
                    selectedRouteId={"2"}
                    defaultRouteId={defaultRouteId}
                    applyStreamFilter={applyStreamFilterStub}
                    fetchAvailableRoutes={fetchAvailableRoutesStub}
                    availableRoutes={fakeAvailableRoutes}
                    history={{ push: historyPushStub }}
                    match={{ params: { routeId: "2" } }}
                />
            )
            subject.setProps({ match: { params: { routeId: "CEAVY" } } })
        })

        it('updates state to url param', () => {
            expect(applyStreamFilterStub).toBeCalledWith([defaultRouteId])
        })

        it('updates state exactly once', () => {
            expect(applyStreamFilterStub).toHaveBeenCalledTimes(1)
        })

        it('updates url to reflect default', () => {
            expect(historyPushStub).toBeCalledWith(defaultRouteId)
        })

        it('updates url exactly once', () => {
            expect(historyPushStub).toHaveBeenCalledTimes(1)
        })
    })

    describe('url is somehow on an invalid route and user types in a valid one', () => {
        beforeEach(() => {
            subject = mount(
                <UrlRouteFilter
                    selectedRouteId={undefined}
                    defaultRouteId={defaultRouteId}
                    applyStreamFilter={applyStreamFilterStub}
                    fetchAvailableRoutes={fetchAvailableRoutesStub}
                    availableRoutes={fakeAvailableRoutes}
                    history={{ push: historyPushStub }}
                    match={{ params: { routeId: undefined } }}
                />
            )
            subject.setProps({ match: { params: { routeId: "2" } } })
        })

        it('updates state to url param', () => {
            expect(applyStreamFilterStub).toBeCalledWith(["2"])
        })

        it('updates state exactly once', () => {
            expect(applyStreamFilterStub).toHaveBeenCalledTimes(1)
        })
    })

    describe('url and state are somehow out of sync already and url is updated', () => {
        beforeEach(() => {
            subject = mount(
                <UrlRouteFilter
                    selectedRouteId={undefined}
                    defaultRouteId={defaultRouteId}
                    applyStreamFilter={applyStreamFilterStub}
                    fetchAvailableRoutes={fetchAvailableRoutesStub}
                    availableRoutes={fakeAvailableRoutes}
                    history={{ push: historyPushStub }}
                    match={{ params: { routeId: "101" } }}
                />
            )
            subject.setProps({ match: { params: { routeId: "2" } } })
        })

        it('updates state to url param', () => {
            expect(applyStreamFilterStub).toBeCalledWith(["2"])
        })

        it('updates state exactly once', () => {
            expect(applyStreamFilterStub).toHaveBeenCalledTimes(1)
        })
    })

    describe('url has valid route and selectedRouteId is updated', () => {
        beforeEach(() => {
            subject = mount(
                <UrlRouteFilter
                    selectedRouteId={"2"}
                    defaultRouteId={defaultRouteId}
                    applyStreamFilter={applyStreamFilterStub}
                    fetchAvailableRoutes={fetchAvailableRoutesStub}
                    availableRoutes={fakeAvailableRoutes}
                    history={{ push: historyPushStub }}
                    match={{ params: { routeId: "2" } }}
                />
            )
            subject.setProps({ selectedRouteId: "101" })
        })

        it('updates url to match state', () => {
            expect(historyPushStub).toBeCalledWith("101")
        })

        it('updates url exactly once', () => {
            expect(historyPushStub).toHaveBeenCalledTimes(1)
        })
    })

    describe('url has valid route and selectedRouteId is set (but not updated)', () => {
        beforeEach(() => {
            subject = mount(
                <UrlRouteFilter
                    selectedRouteId={"2"}
                    defaultRouteId={defaultRouteId}
                    applyStreamFilter={applyStreamFilterStub}
                    fetchAvailableRoutes={fetchAvailableRoutesStub}
                    availableRoutes={fakeAvailableRoutes}
                    history={{ push: historyPushStub }}
                    match={{ params: { routeId: "2" } }}
                />
            )
            subject.setProps({ selectedRouteId: "2" })
        })

        it('does not update url', () => {
            expect(historyPushStub).toHaveBeenCalledTimes(0)
        })
    })

    describe('url is somehow on an invalid route and selectedRouteId is updated', () => {
        beforeEach(() => {
            subject = mount(
                <UrlRouteFilter
                    selectedRouteId={undefined}
                    defaultRouteId={defaultRouteId}
                    applyStreamFilter={applyStreamFilterStub}
                    fetchAvailableRoutes={fetchAvailableRoutesStub}
                    availableRoutes={fakeAvailableRoutes}
                    history={{ push: historyPushStub }}
                    match={{ params: { routeId: undefined } }}
                />
            )
            subject.setProps({ selectedRouteId: "2" })
        })

        it('updates state to default url param', () => {
            expect(applyStreamFilterStub).toBeCalledWith([defaultRouteId])
        })

        it('updates state exactly once', () => {
            expect(applyStreamFilterStub).toHaveBeenCalledTimes(1)
        })

        it('updates url to reflect default', () => {
            expect(historyPushStub).toBeCalledWith(defaultRouteId)
        })

        it('updates url exactly once', () => {
            expect(historyPushStub).toHaveBeenCalledTimes(1)
        })
    })

    describe('url and state are somehow out of sync already and state is updated', () => {
        beforeEach(() => {
            subject = mount(
                <UrlRouteFilter
                    selectedRouteId={undefined}
                    defaultRouteId={defaultRouteId}
                    applyStreamFilter={applyStreamFilterStub}
                    fetchAvailableRoutes={fetchAvailableRoutesStub}
                    availableRoutes={fakeAvailableRoutes}
                    history={{ push: historyPushStub }}
                    match={{ params: { routeId: "101" } }}
                />
            )
            subject.setProps({ selectedRouteId: "2" })
        })

        it('updates url to match state', () => {
            expect(historyPushStub).toBeCalledWith("2")
        })

        it('updates url exactly once', () => {
            expect(historyPushStub).toHaveBeenCalledTimes(1)
        })
    })
})
