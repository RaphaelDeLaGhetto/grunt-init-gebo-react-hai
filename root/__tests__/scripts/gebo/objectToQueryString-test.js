/** @jsx React.DOM */

jest.dontMock('../../../scripts/gebo/objectToQueryString');

var React = require('react/addons'),
    TestUtils = React.addons.TestUtils;

var objectToQueryString = require('../../../scripts/gebo/objectToQueryString');

describe('objectToQueryString', function() {

    it('should return an URL-friendly parameter string', function() {
        var params = {
                response_type: 'token',
                client_id: 'gebo-hai@capitolhill.ca',
                client_name: 'gebo-hai',
                redirect_uri: 'https://localhost:3000/oauth2callback.html',
                scope: '',
            };
        var expectedString = 'response_type=' + encodeURIComponent('token') + '&' +
                             'client_id=' + encodeURIComponent('gebo-hai@capitolhill.ca') + '&' +
                             'client_name=' + encodeURIComponent('gebo-hai') + '&' +
                             'redirect_uri=' + encodeURIComponent('https://localhost:3000/oauth2callback.html') + '&' +
                             'scope=' + encodeURIComponent('');

        var queryString = objectToQueryString(params);

        expect(queryString).toEqual(expectedString);
    });

    it('shouldn\'t barf if given an empty object', function() {
        var queryString = objectToQueryString({});
        expect(queryString).toEqual('');
    });
});
