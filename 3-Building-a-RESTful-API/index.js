/*
* Primary file for the API
*
*/
// Dependencies
const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
// The server should respond to all requests with a string
var server = http.createServer(function(req, res){
    // Get the URL and parse
    var parsedUrl = url.parse(req.url,true)
    // Get the path 
    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g,'');
    // Get the HTTP Method
    var method = req.method.toLowerCase();
    // Get the query string as an object
    var queryStringObject = parsedUrl.query; 
    // Get the headers as an Object
    var headers = req.headers;
    // Get the payload in request, if any
    var decoder = new StringDecoder('utf-8');
    var buffer = '';
    req.on('data',function(data){
        buffer += decoder.write(data);
    });
    req.on('end',function(){
        buffer += decoder.end();
        // Go back to what we where doing before
        // Send the response
        res.end("Hello, World!\n");
        // Log the request path 
        console.log('Request received with this payload: ',buffer);
    });
});
// Start the server, and have it listen on port 3000
server.listen(3000,()=>{console.log("The server is now listening on port 3000...");});
