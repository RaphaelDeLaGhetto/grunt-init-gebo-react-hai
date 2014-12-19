
var FormData = function(form) { 
        var data = form;
        if (Object.keys(data).indexOf('get') > -1) {
          data = form.get();
        }
        return {
            append: function(key, value) {
                data[key] = value;  
            },
            get: function() {
                return data;
            },
        };
    };

module.exports = FormData;
