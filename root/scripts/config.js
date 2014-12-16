/** @jsx React.DOM */

// The jsx flag above is placed here so that the preprocessor will run when the project is being
// built. The files must be concatenated in the order set.

'use strict';

/**
 * This HAI's name and client ID
 */
var name = '{%= name %}';
var clientId = '{%= name %}@example.com';

/**
 * The agent with which this HAI interacts
 */
var gebo = 'https://localhost:3443';

/**
 * Menu options
 */
var menu = {
    authenticated: [
        { label: 'Action', href: '#' },
        { label: 'Logout', href: '#' },
    ],
    anonymous: [
        { label: 'Login', href: '#' },
    ],
};

/**
 * Authentication popup options
 */
var authPopupOptions = {
    name: 'AuthPopup',
    openParams: {
        width: 650,
        height: 300,
        resizable: true,
        scrollbars: true,
        status: true,
    }
};

// For testing
if (typeof module !== 'undefined') {
  module.exports.gebo = gebo;
  module.exports.menu = menu;
  module.exports.authPopupOptions = authPopupOptions;
}
