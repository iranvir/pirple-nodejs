/* 
* Starting a server -- Video 8 -- Parsing HTTP Headers
*/
// Dependencies
const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder; // To much retarded. Please refer the doc, future me! Used it to get the HTTP payload    

// 1. Defining the server
const server = http.createServer(function(req, res){    // This callback function gets called everytime someone sends a request to port 3000
                                                        // Each time it is called, the req and res objects are brand new. 
    // Get the URL and parse it
    var parsedUrl = url.parse(req.url,true);

    console.log(parsedUrl);
    // Get the Path
    var path = parsedUrl.pathname;
    var trimmedPath = path.replace( /^\/+|\/+$/g,'');   // Trim off the excess slashes, e.g, /foo/ becomes /foo

    // Get the query string as an Object
    var queryStringObject = parsedUrl.query;            // This is why there is that "true" in the url.parse method. It turns parsedUrl.query to an object rather than the literal string like "buzz=bazz", instead of {buzz: "bazz"}

    // Get the HTTP Method
    var method = req.method.toLowerCase();              // The toLowerCase() method is called to just standardize the HTTP methods.

    // Get the HTTP headers
    var headers = req.headers;

    // Get the payload, if any, for this we will need another built-in library called StringDecoder
    var decoder = new StringDecoder('utf-8');           // Node deals with something called Streams. To oversimplify, they are information that comes in little bits or chunks as opposed to all at a time.
                                                        // Payloads that come as a part of an HTTP request (maybe even response) come in to the HTTP server as a stream. We need to collect that stream as it comes in.
                                                        // When the stream tells us that we are at the end, we need to coalasce before we can figure out what the payload is.
                                                        
    var buffer = '';                                    // We gather the incremental flow of data to an empty string variable, called "buffer". We do that by binding to an event that the "request" object emits (what does this mean?) and this event is called "data".
    req.on('data',function(data){
        buffer += decoder.write(data);                  // What this means is as the payload is streaming in, everytime it streams in a little bit, the req objects emits the 'data' event that we are binding to.
    });                                                 // We know it to be utf-8, so we Decode it to UTF-8 using the StringDecoder "decoder" that we created. Streams are a fundamental concept in NodeJS.

    req.on('end',function(){                            // We need to move the sending of request res.end("Hello, World\n") and logging of request path inside the req.on('end'...) function. Because async JS would mean they might run before we are done processing the entire payload.
                                                        // Which is not what we want. The req.on('end'...) event will always be called, even if there is no payload.
        buffer += decoder.end();
        // Send the "Hello, World!" response
        res.end('Hello, World!\n');
        // Log the request path
        console.log('Request received with this payload:', buffer); // Comma is needed as queryStringObject is an object and not a string and concatenating a string with an Object crashes the process.
    });
});

// 2. Start the server, and have it listen on port 3000
server.listen(3000,function(){
    console.log("The server is listening on port 3000 now");
});

// Questions and Doubts?
// What does it mean by "bits" or streams? Are these different TCP packets, or is the payload split over different HTTP requests? If the latter is the case, then how is the state maintained across requests?
// What does it mean by the request object "emitting" 'data' event? What does it mean to bind to an event?
// HTTP GET has no payload attached to it. So we need to POST something to the server, for us to be able to stream data to it.
