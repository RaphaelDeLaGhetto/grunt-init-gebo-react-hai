/** @jsx React.DOM */

// For testing
var React;
if (typeof module !== 'undefined') {
    React = require('react');
}

/**
 * Oauth2Callback
 */
var Oauth2Callback = React.createClass({

    /**
     * componentDidMount
     */
    componentDidMount: function() {
        var queryString = window.location.hash.split('#')[1];
        var params = this.parseKeyValue(queryString);
        window.opener.postMessage(params, '*'); 
        window.close();
    },

    /**
     * Parse an escaped URL query string into key-value pairs.
     *
     * @param string
     *
     * @returns Object.<(string|boolean)>
     */
    parseKeyValue: function(queryString) {
        var obj = {}, keyValue, key;

        if (queryString) {
          queryString.split('&').forEach(function(str) {
              keyValue = str.split('=');
              key = decodeURIComponent(keyValue[0]);
              obj[key] = keyValue[1]?decodeURIComponent(keyValue[1]):true;
            });
        }
        return obj;
    },

    /**
     * Render the component
     */
    render: function() {
        return(
            <div className="callback">
                <h1>Finishing authentication...</h1>
            </div>
        );
    }
});

// For testing
if (typeof module !== 'undefined') {
  module.exports = Oauth2Callback;
}
else {
  React.renderComponent(
      <Oauth2Callback />, document.getElementById('callback')
  );
}
