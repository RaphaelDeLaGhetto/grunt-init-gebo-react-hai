
/**
 * Stringify the options for the popup menu 
 *
 * @param object
 *
 * @return string
 */
var formatPopupOptions = function(options) {
    var pairs = [];
    Object.keys(options).forEach(function(key) {
        if (options[key] || options[key] === 0) {
          var value = options[key] === true ? 'yes' : options[key];
          pairs.push(key + '=' + value);
        }
      });
    return pairs.join(',');
  };

if (typeof module !== 'undefined') {
  module.exports = formatPopupOptions;
}
