
var Blob = function(data, type) { 
        var data = data;
        var type = type;
        return {
            get: function() {
                return data + '/' + type;
            },
        };
    };

module.exports = Blob;
