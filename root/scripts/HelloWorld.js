/** @jsx React.DOM */

// For testing
var React;
if (typeof module !== 'undefined') {
    React = require('react');
    Authenticate = require('./gebo/Authenticate');
}

/**
 * HelloWorld
 */
var HelloWorld = React.createClass({

    /**
     * componentDidMount
     */
    getInitialState: function() {
        return {
            friendo: 'world',
        }
    },

    /**
     * componentDidMount
     */
    componentDidMount: function() {
        if (this.props.friendo) {
          this.setState({
              friendo: this.props.friendo,
            });
        }
    },

    /**
     * Called whenever the user's authentication status changes
     *
     * @param object
     */
    authenticate: function(user) {
        if (user.verified) {
          this.setState({
              friendo: user.name,
            });
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
            <div className='helloWorld' ref='helloWorld'>
                <Authenticate ref='authenticated' update={this.authenticate} />
                <h1>Hello, {this.state.friendo}!</h1>
            </div>
        );
    }
});

if (typeof module !== 'undefined') {
  module.exports = HelloWorld;
}
else {
  React.renderComponent(
      <HelloWorld />, document.getElementById('hello')
  );
}
