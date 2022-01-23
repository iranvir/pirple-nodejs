/*
* Request handlers -- Video 14 -- /users service
*/

// Dependencies
const { unwatchFile } = require('fs');
const { deflateRawSync } = require('zlib');
const _data = require('./data');
const helpers = require('./helpers');

// Define the handlers
var handlers = {};

// Users
handlers.users = function(data,callback){
    var acceptableMethods = ['post', 'get','put','delete'];
    if(acceptableMethods.indexOf(data.method) > -1 ){
        handlers._users[data.method](data,callback);
    } else {
        callback(405);
    }
};

// Container for the users submethods
handlers._users = {};

// Users - post
// Required data: firstName, lastName, phone, password, tosAgreement
// Optional data: none
handlers._users.post = function(data,callback) {
    // Check that all the required fields are filled out
    var firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    var lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
    var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
    var tosAgreement = typeof(data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true ? true : false;

    if(firstName && lastName && phone && password && tosAgreement){
        // Make sure that the user, doesn't already exist
        _data.read('users',phone,function(err,data) {
            if(err){ // If an error is returned that means the user doesn't already exist, since the file named after his phone number doesn't exist, so we can continue.
                // Hash the password
                var hashedPassword = helpers.hash(password);
                // Create the user object
                if(hashedPassword) {
                    var userObject = {
                        'firstName' : firstName,
                        'lastName' : lastName,
                        'phone' : phone,
                        'hashedPassword': hashedPassword,
                        'tosAgreement' : true
                    };
    
                    // Store the user
                    _data.create('users',phone,userObject,function(err){
                        if (!err){
                            callback(200);
                        } else {
                            console.log(err);
                            callback(500,{'Error': 'Could not create the new user'});
                        }
                    });
                } else {
                    callback(500, {'Error':'Could not hash the user\'s password'});
                }

            } else {
                // User already exists
                callback(400,{'Error':'A user with that phone number already exists'});
            }
        });
    } else {
        callback(400,{'Error': 'Missing required fields'});
    }
};

// Users - get
// Required data: phone
// Optional data: none
handlers._users.get = function(data,callback) {
    // Check that the phone number is valid
    var phone = typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length == 10 ? data.queryStringObject.phone.trim() : false;
    if(phone){
        // Get the token from the headers
        var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
        // Verify that the given token from the headers is valid
        handlers._tokens.verifyToken(token,phone,function(tokenIsValid){
            if(tokenIsValid){
                // Lookup the user
                _data.read('users',phone,function(err,data){
                    if(!err && data){
                        //Remove the hashed password from the user object before returning it to the requester.
                        delete data.hashedPassword;
                        callback(200,data);
                    } else {
                        callback(404);
                    }
                });
            } else {
                callback(403,{'Error':'Missing required token in header or token is invalid'});
            }
        });
    } else {
        callback(400,{'Error': 'Missing required fields'});
    }
};

// Users - put
// Requried data: phone
// Optional data: firstName, lastName, password (at least one must be specified)
handlers._users.put = function(data,callback) {
    // Check for the required field, i.e, phone
    var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
    // Check for the optional fields
    var firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    var lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
    var tosAgreement = typeof(data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true ? true : false;

    // Error if the phone is invalid
    if(phone) {
        if(firstName || lastName || password) {
            // Get the token from the headers
            var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
             // Verify that the given token from the headers is valid
            handlers._tokens.verifyToken(token,phone,function(tokenIsValid){
                if(tokenIsValid){
                    // Lookup the user
                    _data.read('users', phone, function(err, userData) {
                        if(!err && userData) {
                            // Update the fields necessary
                            if(firstName){
                                userData.firstName = firstName;
                            }
                            if(lastName){
                                userData.lastName = lastName;
                            }
                            if(password){
                                userData.hasedPassword = helpers.hash(password);
                            }
                            // Store the new updates
                            _data.update('users',phone,userData,function(err) {
                                if(!err) {
                                    callback(200);
                                } else {
                                    console.log(err);
                                    callback(500,{'Error':'Could not update the user'});
                                }
                            });
                        } else {
                            callback(400,{'Error':'The specified user doesn\'t exist'});
                        }
                    });
                } else {
                    callback(403,{'Error':'Missing required token in header or token is invalid'});
                }
            });
        } else {
            callback(400, {'Error':'Missing fields to update'});
        }
    } else {
        callback(400, {'Error':'Missing the required field'});
    }
};

// Users - delete
// Required field : phone
// @TODO Only let an authenticated user delete their object. Don't let them delete anyone else's
// @TODO Cleanup (delete) any of the data files associated with this user
handlers._users.delete = function(data,callback) {
    // Check that the phone number is valid
    var phone = typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length == 10 ? data.queryStringObject.phone.trim() : false;
    if(phone){
        // Get the token from the headers
        var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
        // Verify that the given token from the headers is valid
        handlers._tokens.verifyToken(token,phone,function(tokenIsValid){
            if(tokenIsValid){
                // Lookup the user
                _data.read('users',phone,function(err,data){
                    if(!err && data){
                        _data.delete('users',phone,function(err) {
                            if(!err){
                                callback(200);
                            } else {
                                callback(500,{'Error':'Couldn\'t delete specified user'});
                            }
                        });
                    } else {
                        callback(400,{'Error':'Couldn\'t find the specified user'});
                    }
                });
            } else {
                callback(403,{'Error':'Missing required token in header or token is invalid'});
            }
        });
    } else {
        callback(400,{'Error': 'Missing required fields'});
    }
};

// Tokens
handlers.tokens = function(data,callback){
    var acceptableMethods = ['post', 'get','put','delete'];
    if(acceptableMethods.indexOf(data.method) > -1 ){
        handlers._tokens[data.method](data,callback);
    } else {
        callback(405);
    }
};

// Container for all the token methods
handlers._tokens = {};

// Tokens - post
// Required data: phone, password
// Optional data: none
handlers._tokens.post = function(data, callback){
    var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
    var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
    if(phone && password) {
        // Lookup the user who matches that phone number
        _data.read('users',phone,function(err,userData){
            if(!err && userData){
                // Hash the sent password and compare it to the password stored in the user object
                var hashedPassword = helpers.hash(password);
                if(hashedPassword == userData.hashedPassword){
                    // If valid, create a new token with a random name. Set expiration date 1 hour in the future
                    var tokenId = helpers.createRandomString(20);
                    var expires = Date.now() + 1000 * 60 * 60 ; // 1000 is used because the unit is milliseconds
                    var tokenObject = {
                        'phone':phone,
                        'id': tokenId,
                        'expires':expires
                    };
                    
                    // Store the token
                    _data.create('tokens',tokenId,tokenObject,function(err){
                        if(!err){
                            callback(200,tokenObject);
                        } else {
                            callback(500,{'Error':'Could not create the new token'});
                        }
                    });
                } else {
                    callback(400,{'Error': 'Password did not match the specified user\'s stored password'});
                }
            } else {
                callback(400,{'Error':'Could not find the specified user'});
            }
        });
    } else {
        callback(400, {'Error':'Missing required field(s)'});
    }
};

// Tokens - get
// Required data: id
// Optional data: None
handlers._tokens.get = function(data, callback){
    // Check that the id is valid
    var id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;
    if(id){
        // Lookup the user
        _data.read('tokens',id,function(err,tokenData){
            if(!err && tokenData){
                callback(200,tokenData);
            } else {
                callback(404);
            }
        });
    } else {
        callback(400,{'Error': 'Missing required fields'});
    }
};

// Tokens - put
// Required data: id, extend
handlers._tokens.put = function(data, callback){
    var id = typeof(data.payload.id) == 'string' && data.payload.id.trim().length == 20 ? data.payload.id.trim() : false;
    var extend = typeof(data.payload.extend) == 'boolean' && data.payload.extend == true ? true : false;
    if(id && extend){
        // Lookup the token
        _data.read('tokens',id, function(err,tokenData){
            if(!err && tokenData){
                // Check to make sure that the token isn't already expired
                if(tokenData.expires > Date.now()){
                    // Set the expiration an hour from now
                    tokenData.expires = Date.now() + 1000 * 60 * 60 ;

                    // Store the new updates
                    _data.update('tokens',id,tokenData,function(err){
                        if(!err){
                            callback(200);
                        } else {
                            callback(500,{'Error':'Could not update the token\'s expiration'});
                        }
                    });
                } else {
                    callback(400,{'Error':'The token has already expired, and cannot be extended'});
                }
            } else {
                callback(400,{'Error':'Specified token doesn\'t exist'});
            }
        });
    } else {
        callback(400,{'Error':'Missing required field(s) or field(s) are invalid'});
    }
};

// Tokens - delete
// Required data - id
// Optional data - None
handlers._tokens.delete = function(data, callback){
    // Check that the token id  is valid
    var id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;
    if(id){
        // Lookup the user
        _data.read('tokens',id ,function(err,data){
            if(!err && data){
                _data.delete('tokens',id,function(err) {
                    if(!err){
                        callback(200);
                    } else {
                        callback(500,{'Error':'Couldn\'t delete specified token'});
                    }
                });
            } else {
                callback(400,{'Error':'Couldn\'t find the specified token '});
            }
        });
    } else {
        callback(400,{'Error': 'Missing required fields'});
    }
};

// Verify that a given token id is valid for a given user
handlers._tokens.verifyToken = function(id,phone,callback){
    // Lookup the token
    _data.read('tokens',id,function(err,tokenData){
        if(!err && tokenData){
            // Check that the token is for the given user and has not expired
            if(tokenData.phone ==  phone && tokenData.expires > Date.now()){
                callback(true);
            } else {
                callback(false);
            }
        } else {
             callback(false);
        }
    });
}

// Checks handler
handlers.checks = function(data,callback){
    var acceptableMethods = ['post', 'get','put','delete'];
    if(acceptableMethods.indexOf(data.method) > -1 ){
        handlers._checks[data.method](data,callback);
    } else {
        callback(405);
    }
};

// Container for all the checks methods
handlers._checks = {};

// Checks - post
// Required data: protocol, url, method, successCodes, timeoutSeconds
// Optional data: none
handlers._checks.post = function(data,callback){
    // Validate input
    var protocol = typeof(data.payload.protocol) == 'string' && ['https','http'].indexOf(data.payload.protocol) > -1 ? data.payload.payload : false;
    var url = typeof(data.payload.url) == 'string' && data.payload.url.trim().length > 0 ? data.payload.url.trim() : false;
    var method = typeof(data.payload.method) == 'string' && ['post','get','put','delete'].indexOf(data.payload.method) > -1 ? data.payload.method : false;
    var successCodes = typeof(data.payload.successCodes) == 'object' && data.payload.successCodes instanceof Array && data.payload.successCodes.length > 0 ? data.payload.successCodes : false;
    var timeoutSeconds = typeof(data.payload.timeoutSeconds) == 'number' && data.payload.timeoutSeconds % 1 === 0 && data.payload.timeoutSeconds >= 1 && data.payload.timeoutSeconds <= 5  ? data.payload.timeoutSeconds : false;
    
    if(protocol && url && method && timeoutSeconds){
        // Get the token from the headers
        var token = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;

    } else {
        callback(400,{'Error':'Missing required inputs or inputs are invalid'});
    }
}


// Ping handler
handlers.ping = function(data, callback){
    callback(200);
}
// Not found handler
handlers.notFound = function(data,callback){
    callback(404);
};

// Export the module
module.exports = handlers;
