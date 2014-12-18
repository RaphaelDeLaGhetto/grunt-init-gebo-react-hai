/** @jsx React.DOM */

jest.dontMock('../../../scripts/gebo/Authenticate');

var React = require('react/addons'),
    TestUtils = React.addons.TestUtils;

var Authenticate = require('../../../scripts/gebo/Authenticate');

/**
 * Authenticate
 */
var container;
describe('Authenticate', function() {

    beforeEach(function() {
        container = document.createElement('div');
    });

    afterEach(function() {
        React.unmountComponentAtNode(container);
        expect(window._listeners.verified.false.length).toEqual(0);
        window._listeners = undefined;
    });

    it('should attach a listener to the window ', function() {
        expect(window._listeners).toBe(undefined);
        React.renderComponent(<Authenticate update={jest.genMockFunction()} />, container);
        expect(typeof window._listeners.verified).toEqual('object');
    });

    it('should execute the owner callback when the verified event is fired', function() {
        var authenticate = TestUtils.renderIntoDocument(<Authenticate update={jest.genMockFunction()} />);
        expect(authenticate.props.update.mock.calls.length).toEqual(0);

        var event = { detail : { 'some': 'junk' } };
        // Why 1 and not 0?
        //window._listeners.verified.false[1](event);
        window._listeners.verified.false[0](event);

        expect(authenticate.props.update.mock.calls.length).toEqual(1);
        expect(authenticate.props.update.mock.calls[0][0]).toEqual(event.detail);

        // A bunch of conflicting stuff is happening because of the different ways I'm 
        // rendering the components for testing. This bit of hokey pokey ensures the
        // tests in afterEach pass, which ensures that listeners are being unmounted.
        // This whole setup is a bit of a mess, actually
        // 2014-12-18
        authenticate.componentWillUnmount();
    });

    /**
     * componentWillUnmount
     */
    describe('componentWillUnmount', function() {

        it('should remove the event listener from the window', function() {
            var authenticate = TestUtils.renderIntoDocument(<Authenticate update={jest.genMockFunction()} />);
            expect(window._listeners.verified.false.length).toEqual(1);

            authenticate.componentWillUnmount();
            expect(window._listeners.verified.false.length).toEqual(0);
        });
    });
});
