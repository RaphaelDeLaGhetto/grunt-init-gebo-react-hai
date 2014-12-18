/** @jsx React.DOM */

// For testing
var React;
if (typeof module !== 'undefined') {
    React = require('react');
    CustomEvent = function(name, params){ return params;};
    getTokenByPopup = require('./getTokenByPopup');
    logout = require('./logout');
    name = require('../config').name;
    menu = require('../config').menu;
    verifyToken = require('./verifyToken');
}

/**
 * AuthenticateMenu
 */
var AuthenticateMenu = React.createClass({

    /**
     * getInitialState
     */
    getInitialState: function () {

        return {    
            accessToken: localStorage.getItem(name + '-key'),
            name: null,
            email: null,
            admin: false,
            verified: false,
        };
    },

    /**
     * Emit a 'verified' event each time verifyToken
     * returns, whether on success or error
     */
    dispatchEvent: function() {
        var verifiedEvent = new CustomEvent('verified', { detail: this.state });
        window.dispatchEvent(verifiedEvent);   
    },

    /**
     * componentDidMount
     */
    componentDidMount: function() {

        var parent = this;

        // Verify the previously stored token
        if (this.state.accessToken) {
          verifyToken(this.state.accessToken, function(err, data) {
                if (err) {
                  localStorage.clear(name + '-key');
                  parent.setState(parent.getInitialState(), parent.dispatchEvent);
                }
                else {
                  parent.setState({ name: data.name,
                                    email: data.email,
                                    admin: data.admin,
                                    verified: true }, parent.dispatchEvent);
                }
            });
        }

        // Listen for when the authentication dialog returns
        // a token
        window.addEventListener('message', function(event) {
            if (event.data.access_token) {
              verifyToken(event.data.access_token, function(err, data) {
                    if (err) {
                      localStorage.clear(name + '-key');
                      parent.setState(parent.getInitialState(), parent.dispatchEvent);
                    }
                    else {
                      localStorage.setItem(name + '-key', event.data.access_token);
                      parent.setState({ accessToken: event.data.access_token,
                                        name: data.name,
                                        email: data.email,
                                        admin: data.admin,
                                        verified: true }, parent.dispatchEvent);
                    }
                });
            }
            else {
              localStorage.clear(name + '-key');
              parent.setState(parent.getInitialState(), parent.dispatchEvent);
            }
          });
    },

    /**
     * reset
     */
    reset: function() {
        var parent = this;
        logout(function(err) {
            if (!err) {
              localStorage.clear(name + '-key');
              parent.setState(parent.getInitialState(), parent.dispatchEvent);
            }
          });
    },

    /**
     * Render the menu options for a user, depending on authentication status
     */
    renderMenu: function() {
        var options = menu.anonymous;
        if (this.state.verified) {
          options = menu.authenticated; 
        }
        var parent = this;
        var items = options.map(function(option) {
            if (option.label === 'Login') {
              return(<li><a href={option.href} onClick={getTokenByPopup}>{option.label}</a></li>);
            }
            else if (option.label === 'Logout') {
              return(<li><a href={option.href} onClick={parent.reset}>{option.label}</a></li>);
            }
            return(<li><a href={option.href}>{option.label}</a></li>);
        });
        return(
            <ul className="nav navbar-nav">
                {items}
            </ul>
        );
    },

    /**
     * Render the component
     */
    render: function() {
        return(
            <div className="collapse navbar-collapse">
                {this.renderMenu()}
            </div>
        );
    }
});

// For testing
if (typeof module !== 'undefined') {
  module.exports = AuthenticateMenu;
}
else {
  React.renderComponent(
      <AuthenticateMenu />, document.getElementById('authenticate')
  );
}
