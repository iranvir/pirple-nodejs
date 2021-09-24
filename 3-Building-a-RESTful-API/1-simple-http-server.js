/*
* Starting a server -- Video 3 -- Building a RESTful API
* Showing how to create a simple HTTP server and starting it.
*/
// Dependencies
const http = require('http');

/*
The way an HTTP server like this one works:
1. Using the "http" module to define what the server does.
2. We tell the server to start listening on a specific port.
*/

// 1. Defining the server, or telling it what to do
// The server should respond to all requests with a string
const server = http.createServer(function(req, res){
    res.end('Hello, World!\n');
});

// 2. Start the server, and have it listen on port 3000
server.listen(3000,function(){
    console.log("The server is listening on port 3000 now");
});


// Questions and Doubts
// 1. Learn about import mechanism or "require"
// 2. Function callbacks, and the sequence of execution of this script
// 3. Object oriented stuff. Is http.createServer() a method, can we use data in a similar way. What is callback doing there?
