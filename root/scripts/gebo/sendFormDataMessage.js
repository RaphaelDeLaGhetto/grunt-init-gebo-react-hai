// For testing                 
if (typeof module !== 'undefined') {
  $ = require('jquery');       
  gebo = require('./config').gebo;
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
 * @param string
 * @param string
 * @param string
 * @param function
 */
var sendFormDataMessage = function(form, content, email, action, token, done) {

    var fd = new FormData(form);
    fd.append('sender', email);
    fd.append('performative', 'request');
    fd.append('action', 'Message');
    fd.append('content', JSON.stringify(content));
    fd.append('access_token', token);

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
