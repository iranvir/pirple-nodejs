/* 
* Starting a server -- Video 4 -- Parsing Request Paths
*/
// Dependencies
const http = require('http'); // A module to give you HTTP related functionalities like creating servers and clients
const url = require('url'); // A completely different module is used here.
// This is the official Description of url module: The url module provides utilities for URL resolution and parsing. It can be accessed using url.method or url.data like any good object


const server = http.createServer(function(req, res){    // This callback function gets called everytime someone sends a request to port 3000
                                                        // Each time it is called, the req and res objects are brand new. 
    // Get the URL and parse it
    var parsedUrl = url.parse(req.url,true);            // The req object contains a whole bunch of information that the user asks for, here we just focus on req.url.
                                                        // The "true" argument is there for retarded reasons. When we say "true" we are telling url.parse to parse the querystring and return the value to parsedUrl.
                                                        // Legacy AF.
    // Get the Path
    var path = parsedUrl.pathname;
    var trimmedPath = path.replace( /^\/+|\/+$/g,'');   // Trim off the excess slashes, e.g, /foo/ becomes /foo
    // Send the "Hello, World!" response
    res.end('Hello, World!\n');
    // Log the request path
    console.log("Request received on path:"+trimmedPath);
});

// 2. Start the server, and have it listen on port 3000
server.listen(3000,function(){
    console.log("The server is listening on port 3000 now");
});
