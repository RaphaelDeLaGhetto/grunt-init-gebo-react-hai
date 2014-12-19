// For testing                 
if (typeof module !== 'undefined') {
  $ = require('jquery');       
  gebo = require('../config').gebo;
  FormData = function(form) { 
        var data = form;
        return {
            append: function(key, value) {
                data[key] = value;  
            },
            get: function() {
                return data;
            },
        };
    };
}

/**
 * A a typeset document to the corpus
 *
 * @param FormData
 * @param object
 * @param function
 */
var sendFormDataMessage = function(form, message, done) {

    var fd = new FormData(form);
    Object.keys(message).forEach(function(key) {
        if (typeof message[key] === 'object') {
          fd.append(key, JSON.stringify(message[key]));
        }
        else {
          fd.append(key, message[key]);
        }
      });

    return $.ajax({
        url: gebo + '/perform',
        type: 'POST',
        data: fd,
        success: function(data) {
            done();
        },
        error: function(xhr, status, err) {
            done(err);
        },
    });
  };

if (typeof module !== 'undefined') {
  module.exports = sendFormDataMessage;
}
