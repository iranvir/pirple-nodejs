/* 
* Starting a server -- Video 5 -- Parsing HTTP Methods
*/
// Dependencies
const http = require('http');
const url = require('url');


const server = http.createServer(function(req, res){    // This callback function gets called everytime someone sends a request to port 3000
                                                        // Each time it is called, the req and res objects are brand new. 
    // Get the URL and parse it
    var parsedUrl = url.parse(req.url,true);            // The req object contains a whole bunch of information that the user asks for, here we just focus on req.url.
                                                        // The "true" argument is there for retarded reasons. When we say "true" we are telling url.parse to parse the querystring and return the value to parsedUrl.
                                                        // Legacy AF.
    // Get the Path
    var path = parsedUrl.pathname;
    var trimmedPath = path.replace( /^\/+|\/+$/g,'');   // Trim off the excess slashes, e.g, /foo/ becomes /foo

    // Get the HTTP Method
    var method = req.method.toUpperCase(); // The toUpperCase() method is called to just standardize the HTTP methods.
    // Send the "Hello, World!" response
    res.end('Hello, World!\n');
    // Log the request path
    console.log('Request received on path:'+trimmedPath+' with method: '+method);
});

// 2. Start the server, and have it listen on port 3000
server.listen(3000,function(){
    console.log("The server is listening on port 3000 now");
});


// Questions and Doubts:
// 1. How to chain built-in methods like toUpperCase() to req.method object??
// Find out how to find type of a variable in JavaScript and if toUpperCase() is like a built in for whatever type req.method.
// Answered: Turns out that req.method is just a "string" type and so toUpperCase() method makes sense
