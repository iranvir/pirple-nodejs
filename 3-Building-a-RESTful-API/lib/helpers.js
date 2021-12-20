/*
* Helpers for various tasks -- Introduced in video 14 service 2: /users
*/

// Dependencies
const crypto = require('crypto');
const config = require('./config');

// Container for all the helpers
var helpers = {};

// Create a SHA256 hash
helpers.hash = function(str){ // No callbacks. Why?
    if(typeof(str) == 'string' && str.length > 0){
        var hash = crypto.createHmac('sha256',config.hashingSecret).update(str).digest('hex');
        return hash;
    } else {
        return false;
    }
};

// Export the module
module.exports = helpers;
