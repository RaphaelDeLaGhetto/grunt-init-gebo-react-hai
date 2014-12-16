/** @jsx React.DOM */

jest.dontMock('../../../scripts/gebo/verifyToken');
jest.dontMock('../../../scripts/config');

var React = require('react/addons'),
    TestUtils = React.addons.TestUtils;
    
var gebo = require('../../../scripts/config').gebo;

describe('verifyToken', function() {

    it('should initialize', function() {
        var verifyToken = require('../../../scripts/gebo/verifyToken');
    });

    it('should attempt to GET data from the server with the correct parameters', function() {
        var $ = require('jquery');
        var verifyToken = require('../../../scripts/gebo/verifyToken');

        var callback = jest.genMockFunction();
        var request = verifyToken('SomePseudoRandomAuthenticationToken', callback);
        expect($.ajax.mock.calls.length).toEqual(1);
        expect($.ajax.mock.calls[0][0].url).toEqual(gebo + '/verify?access_token=SomePseudoRandomAuthenticationToken');
        expect($.ajax.mock.calls[0][0].type).toEqual('GET');
    });

    it('should call the callback on success', function() {
        var $ = require('jquery');
        var verifyToken = require('../../../scripts/gebo/verifyToken');

        var callback = jest.genMockFunction();
        var request = verifyToken('SomePseudoRandomAuthenticationToken', callback);

        $.ajax.mock.calls[0][0].success({
            name: 'Dan',
            admin: true,
          });

        // No error
        expect(callback.mock.calls[0][0]).toBe(null);
        expect(callback.mock.calls[0][1]).toEqual({
            name: 'Dan',
            admin: true,
          });
    });

    it('should call the callback on error', function() {
        var $ = require('jquery');
        var verifyToken = require('../../../scripts/gebo/verifyToken');

        var callback = jest.genMockFunction();
        var request = verifyToken('SomePseudoRandomAuthenticationToken', callback);

        $.ajax.mock.calls[0][0].error(null, null, 'You couldn\'t be verified for some reason');

        // Error
        expect(callback.mock.calls[0][0]).toEqual('You couldn\'t be verified for some reason');
        expect(callback.mock.calls[0][1]).toBe(undefined);
    });
});
