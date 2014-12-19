/** @jsx React.DOM */

jest.dontMock('../../../scripts/gebo/perform');
jest.dontMock('../../../scripts/config');

var React = require('react/addons'),
    TestUtils = React.addons.TestUtils;
    
var gebo = require('../../../scripts/config').gebo;

/**
 * Constants
 */
var FORM_DATA = {},
    MESSAGE = {
        sender: 'daniel@capitolhill.ca',
        performative: 'request',
        action: 'ls',
        content: {},
        access_token: 'PseudoRandomToken',
    };

describe('perform', function() {

    it('should initialize', function() {
        var perform = require('../../../scripts/gebo/perform');
    });

    it('should attempt to perform via a POST request with the correct parameters', function() {
        var $ = require('jquery');
        var perform = require('../../../scripts/gebo/perform');

        var callback = jest.genMockFunction();
        var request = perform(FORM_DATA, MESSAGE, callback);
        expect($.ajax.mock.calls.length).toEqual(1);
        expect($.ajax.mock.calls[0][0].url).toEqual(gebo + '/perform');
        expect($.ajax.mock.calls[0][0].type).toEqual('POST');
        expect($.ajax.mock.calls[0][0].data.get().sender).toEqual(MESSAGE.sender);
        expect($.ajax.mock.calls[0][0].data.get().performative).toEqual(MESSAGE.performative);
        expect($.ajax.mock.calls[0][0].data.get().action).toEqual(MESSAGE.action);
        expect($.ajax.mock.calls[0][0].data.get().content).toEqual(JSON.stringify(MESSAGE.content));
        expect($.ajax.mock.calls[0][0].data.get().access_token).toEqual(MESSAGE.access_token);
    });

    it('should call the callback on success', function() {
        var $ = require('jquery');
        var perform = require('../../../scripts/gebo/perform');

        var callback = jest.genMockFunction();
        var request = perform(FORM_DATA, MESSAGE, callback);

        $.ajax.mock.calls[0][0].success();

        // No error
        expect(callback.mock.calls[0][0]).toBe(undefined);
    });

    it('should call the callback on error', function() {
        var $ = require('jquery');
        var perform = require('../../../scripts/gebo/perform');

        var callback = jest.genMockFunction();
        var request = perform(FORM_DATA, MESSAGE, callback);

        $.ajax.mock.calls[0][0].error(null, null, 'Something weird happened');

        // Error
        expect(callback.mock.calls[0][0]).toEqual('Something weird happened');
    });
});
