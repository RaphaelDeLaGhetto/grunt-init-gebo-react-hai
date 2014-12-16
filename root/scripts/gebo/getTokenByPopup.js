
// For testing                 
if (typeof module !== 'undefined') {
  $ = require('jquery');
  authPopupOptions = require('../config').gebo;
  clientId = require('../config').clientId;
  gebo = require('../config').gebo;
  name = require('../config').name;
  formatPopupOptions = require('./formatPopupOptions');
  objectToQueryString = require('./objectToQueryString');
}

/**
 * Authenticate with the gebo through a pop up window.
 * The AuthenticateMenu component listens for the
 * returned token.
 */
function getTokenByPopup() {

    var baseUrl = window.location.origin;

    var params = {
            response_type: 'token',
            client_id: clientId,
            client_name: name,
            redirect_uri: baseUrl + '/oauth2callback.html',
            scope: '',
        };

    var url = gebo + '/dialog/authorize?' + objectToQueryString(params);

    window.open(url, authPopupOptions.name, formatPopupOptions(authPopupOptions.openParams));
  };

if (typeof module !== 'undefined') {
  module.exports = getTokenByPopup;
}

