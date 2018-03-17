// Load the http module to create an http server.
var http = require('http'); 
var steem = require('steem');

var tarot = require('./tarot.js');

// Create a function to handle every HTTP request
function handler(req, res){
    res.setHeader('Content-Type', 'text/html');
    res.writeHead(200);
	//console.log('test',tarot.threeCardReading());
    //res.end("<html><body><h1>Hello</h1></body></html>");
	var r1 = "<html><body><h1>";
	var r2 = "</h1></body></html>";
	var r3 = tarot.threeCardReading();
	var answer = r1+r2+r3;
	res.end(answer);
};

//steem test
steem.api.getState('@jeaimetu',function(err, result){
	console.log(err, result);
});

steem.api.getContentReplies('jeaimetu', 'upvoting-collection', function(err, result){
	console.log(err, result);
});

//writing reply
var private_posting_wif = process.ENV.pass;
var parent_permlink = '6c1klq-stereotype';
var json_metadata = '';
const permlink = steem.formatter.commentPermlink(parent_author, parent_permlink)
steem.broadcast.comment (
    private_posting_wif,  // Steemit.com Wallet -> Permissions -> Show Private Key (for Posting)
    'jeaimetu',        // empty for new blog post 
    parent_permlink,      // main tag for new blog post
    'jeaimetu',               // same user the private_posting_key is for
    permlink,             // a slug (lowercase 'a'-'z', '0'-'9', and '-', min 1 character, max 255 characters)
    '',                // human-readable title
    'Posting test through api',                 // body of the post or comment
    json_metadata         // arbitrary metadata
)


// Create a server that invokes the `handler` function upon receiving a request
http.createServer(handler).listen(process.env.PORT, function(err){
  if(err){
    console.log('Error starting http server');
  } else {
    console.log("Server running at http://127.0.0.1:8000/ or http://localhost:8000/");
  };
});
