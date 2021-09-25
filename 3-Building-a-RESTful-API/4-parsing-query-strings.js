/* 
* Starting a server -- Video 6 -- Parsing Query Strings
*/
// Dependencies
const http = require('http');
const url = require('url');

// 1. Defining the server
const server = http.createServer(function(req, res){    // This callback function gets called everytime someone sends a request to port 3000
                                                        // Each time it is called, the req and res objects are brand new. 
    // Get the URL and parse it
    var parsedUrl = url.parse(req.url,true);            // The req object contains a whole bunch of information that the user asks for, here we just focus on req.url.
                                                        // The "true" argument is there for retarded reasons. When we say "true" we are telling url.parse to parse the querystring and return the value to parsedUrl, 
                                                        // i.e, the parsedUrl is not just URL parsed but also the query string is within it
                                                        // Legacy AF.
                                                        // In other words, the "true" converts the "fizz=buzz" part in a URL http://example.com/foo?fizz=buzz to an Object type {fizz: 'buzz'}

    console.log(parsedUrl);
    // Get the Path
    var path = parsedUrl.pathname;
    var trimmedPath = path.replace( /^\/+|\/+$/g,'');   // Trim off the excess slashes, e.g, /foo/ becomes /foo

    // Get the query string as an Object
    var queryStringObject = parsedUrl.query;            // This is why there is that "true" in the url.parse method. It turns parsedUrl.query to an object rather than the literal string like "buzz=bazz"
    // Get the HTTP Method
    var method = req.method.toUpperCase(); // The toUpperCase() method is called to just standardize the HTTP methods.
    // Send the "Hello, World!" response
    res.end('Hello, World!\n');
    // Log the request path
    console.log('Request received on path:'+trimmedPath+' with method: '+ method + ' and with these query string parameters ',queryStringObject); // Comma is needed as queryStringObject is an object and not a string and concatenating a string with an Object crashes the process.
});

// 2. Start the server, and have it listen on port 3000
server.listen(3000,function(){
    console.log("The server is listening on port 3000 now");
});
