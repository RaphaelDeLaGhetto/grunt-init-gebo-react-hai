/** @jsx React.DOM */

jest.dontMock('../../../scripts/gebo/perform');
jest.dontMock('../../../scripts/config');
jest.dontMock('../../../scripts/gebo/__mocks__/FormData');
jest.dontMock('../../../scripts/gebo/__mocks__/Blob');

var React = require('react/addons'),
    TestUtils = React.addons.TestUtils;
    
var gebo = require('../../../scripts/config').gebo,
    FormData = require('../../../scripts/gebo/__mocks__/FormData');

/**
 * Constants
 */
var FORM_DATA = new FormData({});
    MESSAGE = {
        sender: 'daniel@capitolhill.ca',
        performative: 'request',
        action: 'ls',
        content: {},
        access_token: 'PseudoRandomToken',
    };

/**
 * For mocking localStorage
 * 
 * 2014-12-11
 * Courtesy of Martin Danielson
 * https://groups.google.com/forum/#!topic/jestjs/9EPhuNWVYTg
 */
var mock = (function() {
    return {
        createObjectURL: function(blob) {
            return blob.get();
        },
    };
})();
Object.defineProperty(window, 'URL', { value: mock });

/**
 * perform
 */
describe('perform', function() {

    beforeEach(function() {
        MESSAGE.content = {};
      });

    it('should initialize', function() {
        var perform = require('../../../scripts/gebo/perform');
    });

    /**
     * Form data
     */
    it('should attempt to perform via a FormData POST request with the correct parameters', function() {
        var $ = require('jquery');
        var perform = require('../../../scripts/gebo/perform');

        var callback = jest.genMockFunction();
        var request = perform(MESSAGE, FORM_DATA, callback);
        expect($.ajax.mock.calls.length).toEqual(1);
        expect($.ajax.mock.calls[0][0].url).toEqual(gebo + '/perform');
        expect($.ajax.mock.calls[0][0].type).toEqual('POST');
        expect($.ajax.mock.calls[0][0].data.get().sender).toEqual(MESSAGE.sender);
        expect($.ajax.mock.calls[0][0].data.get().performative).toEqual(MESSAGE.performative);
        expect($.ajax.mock.calls[0][0].data.get().action).toEqual(MESSAGE.action);
        expect($.ajax.mock.calls[0][0].data.get().content).toEqual(JSON.stringify(MESSAGE.content));
        expect($.ajax.mock.calls[0][0].data.get().access_token).toEqual(MESSAGE.access_token);
        expect($.ajax.mock.calls[0][0].processData).toBe(false);
        expect($.ajax.mock.calls[0][0].contentType).toBe(false);
    });

    it('should call the callback on success', function() {
        var $ = require('jquery');
        var perform = require('../../../scripts/gebo/perform');

        var callback = jest.genMockFunction();
        var request = perform(MESSAGE, FORM_DATA, callback);

        $.ajax.mock.calls[0][0].success({ some: 'data'});
                    
        // No error
        expect(callback.mock.calls[0][0]).toBe(null);
        expect(callback.mock.calls[0][1]).toEqual({ some: 'data'});
    });

    it('should call the callback on error', function() {
        var $ = require('jquery');
        var perform = require('../../../scripts/gebo/perform');

        var callback = jest.genMockFunction();
        var request = perform(MESSAGE, FORM_DATA, callback);

        $.ajax.mock.calls[0][0].error(null, null, 'Something weird happened');

        // Error
        expect(callback.mock.calls[0][0]).toEqual('Something weird happened');
    });

    /**
     * JSON data
     */
    it('should attempt to perform via a JSON POST request with the correct parameters', function() {
        var $ = require('jquery');
        var perform = require('../../../scripts/gebo/perform');

        var callback = jest.genMockFunction();
        var request = perform(MESSAGE, callback);
        expect($.ajax.mock.calls.length).toEqual(1);
        expect($.ajax.mock.calls[0][0].url).toEqual(gebo + '/perform');
        expect($.ajax.mock.calls[0][0].type).toEqual('POST');
        expect($.ajax.mock.calls[0][0].data.sender).toEqual(MESSAGE.sender);
        expect($.ajax.mock.calls[0][0].data.performative).toEqual(MESSAGE.performative);
        expect($.ajax.mock.calls[0][0].data.action).toEqual(MESSAGE.action);
        expect($.ajax.mock.calls[0][0].data.content).toEqual(JSON.stringify(MESSAGE.content));
        expect($.ajax.mock.calls[0][0].data.access_token).toEqual(MESSAGE.access_token);
        expect($.ajax.mock.calls[0][0].processData).toBe(undefined);
        expect($.ajax.mock.calls[0][0].contentType).toBe(undefined);
    });

    it('should call the callback on successfully processing the JSON message', function() {
        var $ = require('jquery');
        var perform = require('../../../scripts/gebo/perform');

        var callback = jest.genMockFunction();
        var request = perform(MESSAGE, callback);

        $.ajax.mock.calls[0][0].success({ some: 'data'});
                    
        // No error
        expect(callback.mock.calls[0][0]).toBe(null);
        expect(callback.mock.calls[0][1]).toEqual({ some: 'data'});
    });


    it('should call the callback on error while processing the JSON message', function() {
        var $ = require('jquery');
        var perform = require('../../../scripts/gebo/perform');

        var callback = jest.genMockFunction();
        var request = perform(MESSAGE, callback);

        $.ajax.mock.calls[0][0].error(null, null, 'Something weird happened');

        // Error
        expect(callback.mock.calls[0][0]).toEqual('Something weird happened');
    });

    /**
     * File downloads
     */
    describe('File downloads', function() {

        var XMLHttpRequest, xhr;
        beforeEach(function() {
            XMLHttpRequest = require('xmlhttprequest');

            xhr = {
                    open: jest.genMockFunction(),
                    setRequestHeader: jest.genMockFunction(),
                    send: jest.genMockFunction(),
                    getResponseHeader: jest.genMockFunction().mockImplementation(function(header) {
                        if (header === 'Content-Disposition') {
                          return 'attachment; filename="somefile.pdf"'
                        }
                        else if (header === 'Content-Type') {
                          return 'application/pdf'
                        }
                      }),
                };

            XMLHttpRequest.XMLHttpRequest.mockImplementation(function() {
                return xhr;
              });
        });

        it('should open a connection and set headers and responseType', function() {
            var perform = require('../../../scripts/gebo/perform');
    
            var callback = jest.genMockFunction();

            var message = {
                    sender: 'daniel@capitolhill.ca',
                    performative: 'request',
                    action: 'cp',
                    content: { resource: 'fs', id: '123' },
                    access_token: 'PseudoRandomToken',
                };
            var request = perform(message, callback);
    
            // xhr.open
            expect(xhr.open.mock.calls[0][0]).toEqual('POST');
            expect(xhr.open.mock.calls[0][1]).toEqual(gebo + '/perform');

            // xhr.setRequestHeader
            expect(xhr.setRequestHeader.mock.calls[0][0]).toEqual('Content-Type');
            expect(xhr.setRequestHeader.mock.calls[0][1]).toEqual('application/json;charset=UTF-8');

            // xhr.responseType
            expect(xhr.responseType).toEqual('arraybuffer');

            // xhr.onload
            expect(typeof xhr.onload).toEqual('function');

            // xhr.send
            expect(xhr.send.mock.calls[0][0]).toEqual(JSON.stringify(message));

            // Should this be called?
            expect(callback.mock.calls.length).toEqual(0);
        });

        it('should do something to force the file download', function() {
            var perform = require('../../../scripts/gebo/perform');
            var callback = jest.genMockFunction();
            var message = {
                    sender: 'daniel@capitolhill.ca',
                    performative: 'request',
                    action: 'cp',
                    content: { resource: 'fs', id: '123' },
                    access_token: 'PseudoRandomToken',
                };
            var request = perform(message, callback);

            xhr.status = 200;
            xhr.statusText = 'Okaleedokelee';
            xhr.onload();

            console.log('WHAT SHOULD HAPPEN HERE AND HOW DO I TEST?');

            // Should this be called?
            expect(callback.mock.calls.length).toEqual(0);
        });

        it('should return an error if something goes wrong', function() {
            var perform = require('../../../scripts/gebo/perform');
            var callback = jest.genMockFunction();
            var message = {
                    sender: 'daniel@capitolhill.ca',
                    performative: 'request',
                    action: 'cp',
                    content: { resource: 'fs', id: '123' },
                    access_token: 'PseudoRandomToken',
                };
            var request = perform(message, callback);
 
            xhr.status = 401;
            xhr.statusText = 'Am I doing this right?';
            xhr.onload();

            expect(callback.mock.calls.length).toEqual(1);
            expect(callback.mock.calls[0][0]).toEqual('Am I doing this right?');
        });


    });
});
