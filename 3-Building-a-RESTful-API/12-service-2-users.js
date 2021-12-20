 /* 
* Starting a server -- Video 14 -- Adding /users service
*/
// Dependencies
const http = require('http');
const https = require('https');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const fs = require('fs');
const config = require('./config');
const handlers = require('./lib/handlers');

// Instantiating the HTTP Server
const httpServer = http.createServer(function(req, res){
    unifiedServer(req,res);
});

// Start the HTTP Server
httpServer.listen(config.httpPort,function(){
    console.log("The server is listening on port "+config.httpPort);
});

// Instantiating the HTTPS Server
const httpsServerOptions = {
    'key' : fs.readFileSync('./https/key.pem'),
    'cert' : fs.readFileSync('./https/cert.pem')
};

const httpsServer = https.createServer(httpsServerOptions, function(req, res){
    unifiedServer(req,res);
});

// Start the HTTPS Server
httpsServer.listen(config.httpsPort,function(){
    console.log("The server is listening on port "+config.httpsPort);
});

// Server logic for both the http and https server
var unifiedServer = function(req,res){
    var parsedUrl = url.parse(req.url,true);
    var path = parsedUrl.pathname;
    var trimmedPath = path.replace( /^\/+|\/+$/g,'');
    var queryStringObject = parsedUrl.query;
    var method = req.method.toLowerCase();
    var headers = req.headers;

    // Get the payload, if any, for this we will need another built-in library called StringDecoder
    var decoder = new StringDecoder('utf-8');                                                        
    var buffer = '';
    req.on('data',function(data){
        buffer += decoder.write(data);
    });

    req.on('end',function(){
        buffer += decoder.end();
        var chosenHandler = typeof(router[trimmedPath]) != 'undefined' ? router[trimmedPath] : handlers.notFound;
        var data = {
            'trimmedPath' : trimmedPath,
            'queryStringObject' : queryStringObject,
            'method' : method,
            'headers' : headers,
            'payload' : buffer
        }
        chosenHandler(data,function(statusCode, payload){
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
            payload = typeof(payload) == 'object' ? payload : {};
            var payloadString = JSON.stringify(payload);

            // Return the response
            res.setHeader('Content-Type','application/json');
            res.writeHead(statusCode);
            res.end(payloadString);

            // Log the request
            console.log('Returning this response: ', statusCode, payloadString);
        });
    });
};

// A PATH based router
var router = {
    'ping' : handlers.ping,
    'users' : handlers.users
}; 
