// For testing                 
if (typeof module !== 'undefined') {
  $ = require('jquery');       
  gebo = require('../config').gebo;
  FormData = require('./__mocks__/FormData');
  Blob = require('./__mocks__/Blob');
  XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
  geboEmail = require('../config').geboEmail;
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

    var data = {}, processData, contentType;
    if (typeof form === 'object') {
      data = new FormData(form);
      processData = contentType = false;
    }
    else {
      done = form;
    }

    // Send receiver, if not set already
    if (!message.receiver) {
      message.receiver = geboEmail;
    }

    // For downloading a file
    if (message.action === 'cp' && message.content.resource === 'fs') {

      var xhr = new XMLHttpRequest(); 
      xhr.open('POST', gebo + '/perform');
      xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
      xhr.responseType = 'arraybuffer';

      xhr.onload = function(e) {
            if (this.status === 200) {

              // Adapted from: http://stackoverflow.com/questions/16086162/handle-file-download-from-ajax-post
              // 2015-1-7, Jonathan Amend
              var disposition = this.getResponseHeader('Content-Disposition');

              // Get the file name
              var filename;
              if (disposition && disposition.indexOf('attachment') !== -1) {
                var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                var matches = filenameRegex.exec(disposition);
                if (matches != null && matches[1]) {
                  filename = matches[1].replace(/['"]/g, '');
                }
              }

              var type = xhr.getResponseHeader('Content-Type');
              var blob = new Blob([this.response], { type: type });
      
              if (typeof window.navigator.msSaveBlob !== 'undefined') {
                // IE workaround for "HTML7007: One or more blob URLs were
                // revoked by closing the blob for which they were created.
                // These URLs will no longer resolve as the data backing the
                // URL has been freed."
                window.navigator.msSaveBlob(blob, filename);
              }
              else {
                var URL = window.URL || window.webkitURL;
                var downloadUrl = URL.createObjectURL(blob);
    
                if (filename) {
                  // use HTML5 a[download] attribute to specify filename
                  var a = document.createElement('a');

                  // safari doesn't support this yet
                  if (typeof a.download === 'undefined') {
                    window.location = downloadUrl;
                  }
                  else {
                    a.href = downloadUrl;
                    a.download = filename;
                    document.body.appendChild(a);
                    a.click();
                  }
                }
                else {
                  window.location = downloadUrl;
                }
                setTimeout(function () { URL.revokeObjectURL(downloadUrl); }, 100); // cleanup
              }
            }
            else {
              done(this.statusText);
            }
        };

      xhr.send(JSON.stringify(message));
    }
    // For everything else 
    else {
  
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
          processData: processData,
          contentType: contentType,
          data: data,
          success: function(response, status, xhr) {
              done(null, response);
          },
          error: function(xhr, status, err) {
              done(err);
          },
      });
    }
  };

if (typeof module !== 'undefined') {
  module.exports = perform;
}
