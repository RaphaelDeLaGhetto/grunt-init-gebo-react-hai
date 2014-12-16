// For testing                 
if (typeof module !== 'undefined') {
  $ = require('jquery');       
  gebo = require('../config').gebo;
}

/**
 * Verify the OAuth2 token returned by the gebo
 *
 * @param string
 * @param function
 */
var verifyToken = function(token, done) {
    return $.ajax({
        url: gebo + '/verify?access_token=' + token,
        type: 'GET',
        success: function(data) {
            done(null, data);
        },
        error: function(xhr, status, err) {
            done(err);
        },
    });
  };

if (typeof module !== 'undefined') {
  module.exports = verifyToken;
}
