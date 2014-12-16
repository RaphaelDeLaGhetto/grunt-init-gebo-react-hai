/** @jsx React.DOM */

jest.dontMock('../../../scripts/gebo/Oauth2Callback');

var React = require('react/addons'),
    TestUtils = React.addons.TestUtils;

var Oauth2Callback = require('../../../scripts/gebo/Oauth2Callback');

/**
 * Mock the parent (opener) window
 */
var mock = (function() {
    return {
        postMessage: jest.genMockFunction(),
    };
})();
Object.defineProperty(window, 'opener', { value: mock });

/**
 * Mock the window close function, otherwise the
 * document is undefined for tests
 */
window.close = jest.genMockFunction();

/**
 * A pretend query string, as set by the gebo-server
 */
window.location.hash = 'param1=somedata&param2=someotherdata';

/**
 * Oauth2Callback
 */
describe('Oauth2Callback', function() {

    beforeEach(function() {
        window.opener.postMessage.mockClear();
    });

    it('should initialize', function() {
        var callback = TestUtils.renderIntoDocument(<Oauth2Callback />);
    });

    it('should send a message to the parent window', function() {
        var callback = TestUtils.renderIntoDocument(<Oauth2Callback />);
        expect(window.opener.postMessage.mock.calls.length).toEqual(1);
        expect(window.opener.postMessage).toBeCalledWith({ param1: 'somedata', param2: 'someotherdata' }, '*');
    });

    it('should call the window.close function', function() {
        var callback = TestUtils.renderIntoDocument(<Oauth2Callback />);
        expect(window.close.mock.calls.length).toEqual(1);
        expect(window.close).toBeCalled();
    });

    /**
     * parseKeyValue
     */
    describe('parseKeyValue', function() {

        it('should parse an escaped URL query string into key-value pairs', function() {
            var callback = TestUtils.renderIntoDocument(<Oauth2Callback />);
            var string = 'access_token=SomePseudoRandomStringOfCharacters&token_type=Bearer';
            var obj = callback.parseKeyValue(string);
            expect(Object.keys(obj).length).toEqual(2);
            expect(obj.access_token).toEqual('SomePseudoRandomStringOfCharacters');
            expect(obj.token_type).toEqual('Bearer');
        });

        it('should correctly handle unpaired keys', function() {
            var callback = TestUtils.renderIntoDocument(<Oauth2Callback />);
            var string = 'access_token&token_type';
            var obj = callback.parseKeyValue(string);
            expect(Object.keys(obj).length).toEqual(2);
            expect(obj.access_token).toBe(true);
            expect(obj.token_type).toBe(true);
        });

        it('shouldn\'t barf if given an empty string', function() {
            var callback = TestUtils.renderIntoDocument(<Oauth2Callback />);
            var obj = callback.parseKeyValue('');
            expect(Object.keys(obj).length).toEqual(0);
            expect(obj).toEqual({});
        });
    });
});
