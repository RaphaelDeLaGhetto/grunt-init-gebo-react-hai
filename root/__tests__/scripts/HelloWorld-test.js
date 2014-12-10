/** @jsx React.DOM */

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
});
