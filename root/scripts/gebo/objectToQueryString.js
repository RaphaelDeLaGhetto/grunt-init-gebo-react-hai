
/**
 * Given an flat object, return an URL-friendly query string.  Note
 * that for a given object, the return value may be.
 *
 * @param object - a flat object containing keys for a query string.
 * 
 * @returns string - an URL-friendly query string.
 */
var objectToQueryString = function(obj) {
    var str = [];
    Object.keys(obj).forEach(function(o) {
        str.push(encodeURIComponent(o) + '=' + encodeURIComponent(obj[o]));
      });
    return str.join('&');
  };

if (typeof module !== 'undefined') {
  module.exports = objectToQueryString;
}
