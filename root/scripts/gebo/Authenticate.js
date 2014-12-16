/** @jsx React.DOM */

// For testing
var React;
if (typeof module !== 'undefined') {
  React = require('react');
}

/**
 * Authenticate
 *
 * This just listens for events in order to tell the owner
 * component that the user's authentication status
 * has changed
 *
 * <Owner>
 *  <Authenticate update={owner.callback} />
 * </Owner>
 */
var Authenticate = React.createClass({

    /**
     * componentDidMount
     */
    componentDidMount: function() {
        var update = this.props.update;
        window.addEventListener('verified', function(event) {
            update(event.detail);
        });
    },

    /**
     * Render the component
     */
    render: function() {
        return(
            <div className='authenticate'></div>
        );
    }
});

// For testing
if (typeof module !== 'undefined') {
  module.exports = Authenticate;
}
