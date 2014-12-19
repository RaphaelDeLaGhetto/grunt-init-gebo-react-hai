// For testing                 
if (typeof module !== 'undefined') {
  $ = require('jquery');       
  gebo = require('../config').gebo;
  FormData = require('./__mocks__/FormData');
}

/**
 * Send a request to the gebo. The message can be sent
 * as FormData or JSON.
 *
 * @param object
 * @param FormData - optional
 * @param function
 */
var perform = function(message, form, done) {

    var data = {};
    if (typeof form === 'object') {
      data = new FormData(form);
    }
    else {
      done = form;
    }

    Object.keys(message).forEach(function(key) {
        var value = message[key];
        if (typeof message[key] === 'object') {
          value = JSON.stringify(value);
        }

        if (typeof form === 'object') {
          data.append(key, value);
        }
        else {
          data[key] = value;
        }
      });

    return $.ajax({
        url: gebo + '/perform',
        type: 'POST',
        data: data,
        success: function(data) {
            done();
        },
        error: function(xhr, status, err) {
            done(err);
        },
    });
  };

if (typeof module !== 'undefined') {
  module.exports = perform;
}
