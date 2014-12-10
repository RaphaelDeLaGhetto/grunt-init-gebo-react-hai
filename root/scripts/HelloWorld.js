/** @jsx React.DOM */

// For testing
var React;
if (typeof module !== 'undefined') {
    React = require('react');
}

/**
 * HelloWorld
 */
var HelloWorld = React.createClass({

    /**
     * Render the component
     */
    render: function() {
        return(
            <div className='helloWorld'>
                <h1>Hello, world!</h1>
            </div>
        );
    }
});

// For testing
if (typeof module !== 'undefined') {
  module.exports = HelloWorld;
}
else {
  React.renderComponent(
      <HelloWorld />, document.getElementById('hello')
  );
}
