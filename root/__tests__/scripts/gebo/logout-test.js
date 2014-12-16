/** @jsx React.DOM */

jest.dontMock('../../../scripts/gebo/logout');
jest.dontMock('../../../scripts/config');

var React = require('react/addons'),
    TestUtils = React.addons.TestUtils;
    
var gebo = require('../../../scripts/config').gebo;

describe('logout', function() {

    it('should initialize', function() {
        var logout = require('../../../scripts/gebo/logout');
    });

    it('should attempt to logout from the server via a GET get request with the correct parameters', function() {
        var $ = require('jquery');
        var logout = require('../../../scripts/gebo/logout');

        var callback = jest.genMockFunction();
        var request = logout(callback);
        expect($.ajax.mock.calls.length).toEqual(1);
        expect($.ajax.mock.calls[0][0].url).toEqual(gebo + '/logout');
        expect($.ajax.mock.calls[0][0].type).toEqual('GET');
    });

    it('should call the callback on success', function() {
        var $ = require('jquery');
        var logout = require('../../../scripts/gebo/logout');

        var callback = jest.genMockFunction();
        var request = logout(callback);

        $.ajax.mock.calls[0][0].success();

        // No error
        expect(callback.mock.calls[0][0]).toBe(undefined);
    });

    it('should call the callback on error', function() {
        var $ = require('jquery');
        var logout = require('../../../scripts/gebo/logout');

        var callback = jest.genMockFunction();
        var request = logout(callback);

        $.ajax.mock.calls[0][0].error(null, null, 'Something weird happened');

        // Error
        expect(callback.mock.calls[0][0]).toEqual('Something weird happened');
    });
});
