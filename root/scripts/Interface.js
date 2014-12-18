/** @jsx React.DOM */

// For testing
var React;
if (typeof module !== 'undefined') {
    React = require('react');
    Authenticate = require('./gebo/Authenticate');
}

/**
 * Interface
 */
var Interface = React.createClass({

    /**
     * componentDidMount
     */
    getInitialState: function() {
        return {
            email: 'You haven\'t signed in',
        };
    },

    /**
     * Called whenever the user's authentication status changes
     *
     * @param object
     */
    authenticate: function(user) {
        if (user.verified) {
          this.setState(user);
        }
        else {
          this.setState(this.getInitialState());
        }
    },

    /**
     * Render the component
     */
    render: function() {
        return(
            <div className='interface'>
                <Authenticate ref='authenticated' update={this.authenticate} />
                <h3>Client ID: {this.state.email}</h3>
            </div>
        );
    }
});

if (typeof module !== 'undefined') {
  module.exports = Interface;
}
else {
  React.renderComponent(
      <Interface />, document.getElementById('interface')
  );
}
