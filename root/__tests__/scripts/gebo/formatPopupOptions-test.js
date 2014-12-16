/** @jsx React.DOM */

jest.dontMock('../../../scripts/gebo/formatPopupOptions');

var React = require('react/addons'),
    TestUtils = React.addons.TestUtils;

var formatPopupOptions = require('../../../scripts/gebo/formatPopupOptions');

describe('formatPopupOptions', function() {

    it('should return an popup options-friendly parameter string', function() {
        var params = {
                width: 650,
                height: 300,
                resizable: true,
                scrollbars: true,
                status: true,
            };
        var expectedString = 'width=650,height=300,resizable=yes,scrollbars=yes,status=yes';

        var optionsString = formatPopupOptions(params);
        expect(optionsString).toEqual(expectedString);
    });

    it('shouldn\'t barf if given an empty object', function() {
        var optionsString = formatPopupOptions({});
        expect(optionsString).toEqual('');
    });
});
