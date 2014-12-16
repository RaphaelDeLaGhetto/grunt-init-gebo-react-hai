/** @jsx React.DOM */

jest.dontMock('../../scripts/gebo/Authenticate');
jest.dontMock('../../scripts/HelloWorld');

var React = require('react/addons'),
    TestUtils = React.addons.TestUtils;

var HelloWorld = require('../../scripts/HelloWorld');

/**
 * HelloWorld
 */
describe('HelloWorld', function() {

    it('should shout out to the world', function() {
        var helloWorld = TestUtils.renderIntoDocument(<HelloWorld />);
        var header = TestUtils.scryRenderedDOMComponentsWithTag(helloWorld, 'h1');
        expect(header.length).toEqual(1);
        expect(header[0].getDOMNode().textContent).toEqual('Hello, world!');
    });

    it('should shout out to the world if friendo is null', function() {
        var helloWorld = TestUtils.renderIntoDocument(<HelloWorld friendo={null} />);
        var header = TestUtils.scryRenderedDOMComponentsWithTag(helloWorld, 'h1');
        expect(header.length).toEqual(1);
        expect(header[0].getDOMNode().textContent).toEqual('Hello, world!');
    });

    it('should shout out to the world if friendo is undefined', function() {
        var helloWorld = TestUtils.renderIntoDocument(<HelloWorld friendo={undefined} />);
        var header = TestUtils.scryRenderedDOMComponentsWithTag(helloWorld, 'h1');
        expect(header.length).toEqual(1);
        expect(header[0].getDOMNode().textContent).toEqual('Hello, world!');
    });

    it('should shout out to your friendo', function() {
        var helloWorld = TestUtils.renderIntoDocument(<HelloWorld friendo='Dan' />);
        var header = TestUtils.scryRenderedDOMComponentsWithTag(helloWorld, 'h1');
        expect(header.length).toEqual(1);
        expect(header[0].getDOMNode().textContent).toEqual('Hello, Dan!');
    });

    /**
     * authenticate
     */
    describe('authenticate', function() {
        it('should shout out to your new friendo when authenticated and verified', function() {
            var helloWorld = TestUtils.renderIntoDocument(<HelloWorld friendo={null} />);
            var header = TestUtils.scryRenderedDOMComponentsWithTag(helloWorld, 'h1');
            expect(header.length).toEqual(1);
            expect(header[0].getDOMNode().textContent).toEqual('Hello, world!');
    
            helloWorld.authenticate({ verified: true, name: 'Dan' });

            header = TestUtils.scryRenderedDOMComponentsWithTag(helloWorld, 'h1');
            expect(header[0].getDOMNode().textContent).toEqual('Hello, Dan!');
        });

        it('should shout out to the world if your friendo is no longer verified', function() {
            var helloWorld = TestUtils.renderIntoDocument(<HelloWorld friendo={null} />);
            var header = TestUtils.scryRenderedDOMComponentsWithTag(helloWorld, 'h1');
            expect(header.length).toEqual(1);
            expect(header[0].getDOMNode().textContent).toEqual('Hello, world!');
    
            helloWorld.authenticate({ verified: true, name: 'Dan' });

            header = TestUtils.scryRenderedDOMComponentsWithTag(helloWorld, 'h1');
            expect(header[0].getDOMNode().textContent).toEqual('Hello, Dan!');

            helloWorld.authenticate({ verified: false });

            header = TestUtils.scryRenderedDOMComponentsWithTag(helloWorld, 'h1');
            expect(header[0].getDOMNode().textContent).toEqual('Hello, world!');
        });
    });
});
