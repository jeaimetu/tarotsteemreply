// Load the http module to create an http server.
var http = require('http'); 

var tarot = require('./tarot.js');

// Create a function to handle every HTTP request
function handler(req, res){
    res.setHeader('Content-Type', 'text/html');
    res.writeHead(200);
	console.log("test",tarot.threeCardReading);
    res.end("<html><body><h1>Hello</h1></body></html>");
};

// Create a server that invokes the `handler` function upon receiving a request
http.createServer(handler).listen(process.env.PORT, function(err){
  if(err){
    console.log('Error starting http server');
  } else {
    console.log("Server running at http://127.0.0.1:8000/ or http://localhost:8000/");
  };
});
