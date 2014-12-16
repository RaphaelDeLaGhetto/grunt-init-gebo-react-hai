// For testing                 
if (typeof module !== 'undefined') {
  $ = require('jquery');       
  gebo = require('../config').gebo;
}

/**
 * Deauthenticate with the server
 *
 * @param function
 */
var logout = function(done) {
    return $.ajax({
        url: gebo + '/logout',
        type: 'GET',
        success: function(data) {
            done();
        },
        error: function(xhr, status, err) {
            done(err);
        },
    });
  };

if (typeof module !== 'undefined') {
  module.exports = logout;
}
