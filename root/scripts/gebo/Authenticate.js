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
        window.addEventListener('verified', this.update, false);
    },

    /**
     * update
     */
    update: function(event) {
        this.props.update(event.detail);
    },

    /**
     * componentWillUnmount
     */
    componentWillUnmount: function() {
        window.removeEventListener('verified', this.update, false);
    },

    /**
     * Render the component
     */
    render: function() {
        return(
            <div className='authenticate' ref='authenticate'></div>
        );
    }
});

// For testing
if (typeof module !== 'undefined') {
  module.exports = Authenticate;
}
