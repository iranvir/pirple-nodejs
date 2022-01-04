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

// Create a string of random alphanumeric characters of a given length
helpers.createRandomString = function(strLength){
    strLength = typeof(strLength) == 'number' && strLength > 0 ? strLength : false;
    if(strLength){
        // Define all the possible characters that could go into a string
        var possibleCharacter = 'abcdefghijklmnopqrstuvwxyz0123456789';

        // Start the final string
        var str = '';
        for(i = 1; i<= strLength; i++){
            // Get a random character from the possibleCharacters string
            var randomCharacter = possibleCharacter.charAt(Math.floor(Math.random() * possibleCharacter.length));
            // Applend this to the final string
            str+=randomCharacter;
        }
        // Return the final string
        return str;
    } else {
        return false;
    }
};
// Export the module
module.exports = helpers;
