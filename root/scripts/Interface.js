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
     * componentDidMount
     */
//    componentDidMount: function() {
//        if (this.props.friendo) {
//          this.setState({
//              friendo: this.props.friendo,
//            });
//        }
//    },

    /**
     * Called whenever the user's authentication status changes
     *
     * @param object
     */
    authenticate: function(user) {
                    console.log('authenticated', user);
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
                <h1>Client ID: {this.state.email}</h1>
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
