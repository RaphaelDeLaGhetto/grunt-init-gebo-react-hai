/** @jsx React.DOM */

jest.dontMock('../../scripts/sendFormDataMessage');
jest.dontMock('../../scripts/config');

var React = require('react/addons'),
    TestUtils = React.addons.TestUtils;
    
var gebo = require('../../scripts/config').gebo;

/**
 * Constants
 */
var EMAIL = 'daniel@capitolhill.ca',
    TOKEN = 'PseudoRandomToken',
    ACTION = 'ls',
    CONTENT = {},
    FORM_DATA = {};

describe('sendFormDataMessage', function() {

    it('should initialize', function() {
        var sendFormDataMessage = require('../../scripts/sendFormDataMessage');
    });

    it('should attempt to sendFormDataMessage via a POST request with the correct parameters', function() {
        var $ = require('jquery');
        var sendFormDataMessage = require('../../scripts/sendFormDataMessage');

        var callback = jest.genMockFunction();
        var request = sendFormDataMessage(FORM_DATA, CONTENT, EMAIL, ACTION, TOKEN, callback);
        expect($.ajax.mock.calls.length).toEqual(1);
        expect($.ajax.mock.calls[0][0].url).toEqual(gebo + '/perform');
        expect($.ajax.mock.calls[0][0].type).toEqual('POST');
        expect($.ajax.mock.calls[0][0].data.get().sender).toEqual(EMAIL);
        expect($.ajax.mock.calls[0][0].data.get().performative).toEqual('request');
        expect($.ajax.mock.calls[0][0].data.get().action).toEqual(ACTION);
        expect($.ajax.mock.calls[0][0].data.get().content).toEqual(JSON.stringify(CONTENT));
        expect($.ajax.mock.calls[0][0].data.get().access_token).toEqual(TOKEN);
    });

    it('should call the callback on success', function() {
        var $ = require('jquery');
        var sendFormDataMessage = require('../../scripts/sendFormDataMessage');

        var callback = jest.genMockFunction();
        var request = sendFormDataMessage(FORM_DATA, CONTENT, EMAIL, ACTION, TOKEN, callback);

        $.ajax.mock.calls[0][0].success();

        // No error
        expect(callback.mock.calls[0][0]).toBe(undefined);
    });

    it('should call the callback on error', function() {
        var $ = require('jquery');
        var sendFormDataMessage = require('../../scripts/sendFormDataMessage');

        var callback = jest.genMockFunction();
        var request = sendFormDataMessage(FORM_DATA, CONTENT, EMAIL, ACTION, TOKEN, callback);

        $.ajax.mock.calls[0][0].error(null, null, 'Something weird happened');

        // Error
        expect(callback.mock.calls[0][0]).toEqual('Something weird happened');
    });
});
