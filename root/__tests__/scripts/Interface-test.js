/** @jsx React.DOM */

jest.dontMock('../../scripts/gebo/Authenticate');
jest.dontMock('../../scripts/Interface');

var React = require('react/addons'),
    TestUtils = React.addons.TestUtils;

var Interface = require('../../scripts/Interface');

/**
 * Interface
 */
describe('Interface', function() {

    it('should notify the user that he hasn\'t been authenticated', function() {
        var interface = TestUtils.renderIntoDocument(<Interface />);
        var header = TestUtils.scryRenderedDOMComponentsWithTag(interface, 'h3');
        expect(header.length).toEqual(1);
        expect(header[0].getDOMNode().textContent).toEqual('Client ID: You haven\'t signed in');
    });

    /**
     * authenticate
     */
    describe('authenticate', function() {

        it('should notify your friendo that he\'s been authenticated and verified', function() {
            var interface = TestUtils.renderIntoDocument(<Interface />);
            var header = TestUtils.scryRenderedDOMComponentsWithTag(interface, 'h3');
            expect(header.length).toEqual(1);
            expect(header[0].getDOMNode().textContent).toEqual('Client ID: You haven\'t signed in');
    
            interface.authenticate({ verified: true, email: 'daniel@capitolhill.ca', name: 'Dan' });

            header = TestUtils.scryRenderedDOMComponentsWithTag(interface, 'h3');
            expect(header[0].getDOMNode().textContent).toEqual('Client ID: daniel@capitolhill.ca');
        });

        it('should reset the interface when your friendo is no longer authenticated', function() {
            var interface = TestUtils.renderIntoDocument(<Interface friendo={null} />);
            var header = TestUtils.scryRenderedDOMComponentsWithTag(interface, 'h3');
            expect(header.length).toEqual(1);
            expect(header[0].getDOMNode().textContent).toEqual('Client ID: You haven\'t signed in');
    
            interface.authenticate({ verified: true, email: 'daniel@capitolhill.ca', name: 'Dan' });

            header = TestUtils.scryRenderedDOMComponentsWithTag(interface, 'h3');
            expect(header[0].getDOMNode().textContent).toEqual('Client ID: daniel@capitolhill.ca');

            interface.authenticate({ verified: false });

            header = TestUtils.scryRenderedDOMComponentsWithTag(interface, 'h3');
            expect(header[0].getDOMNode().textContent).toEqual('Client ID: You haven\'t signed in');
        });
    });
});
