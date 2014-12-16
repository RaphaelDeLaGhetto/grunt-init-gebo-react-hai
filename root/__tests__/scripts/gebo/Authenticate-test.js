/** @jsx React.DOM */

jest.dontMock('../../../scripts/gebo/Authenticate');

var React = require('react/addons'),
    TestUtils = React.addons.TestUtils;

var Authenticate = require('../../../scripts/gebo/Authenticate');

/**
 * Authenticate
 */
describe('Authenticate', function() {

    it('should attach a listener to the window ', function() {
        expect(window._listeners).toBe(undefined);
        var authenticate = TestUtils.renderIntoDocument(<Authenticate update={jest.genMockFunction()} />);
        expect(typeof window._listeners.verified).toEqual('object');
    });

    it('should execute the owner callback when the verified event is fired', function() {
        var authenticate = TestUtils.renderIntoDocument(<Authenticate update={jest.genMockFunction()} />);
        expect(authenticate.props.update.mock.calls.length).toEqual(0);

        var event = { detail : { 'some': 'junk' } };
        // Why 1 and not 0?
        window._listeners.verified.false[1](event);

        expect(authenticate.props.update.mock.calls.length).toEqual(1);
        expect(authenticate.props.update.mock.calls[0][0]).toEqual(event.detail);
    });
});
