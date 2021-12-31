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

// Parse a JSON string to an object in all cases, without throwing..because by default it throws the failure and don't return anything (I think)
helpers.parseJsonToObject = function(str){
    try{
        var obj = JSON.parse(str);
        return obj;
    } catch(e) {
        return {};
    }
};

// Export the module
module.exports = helpers;
