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
/*
steem.api.getState('@jeaimetu',function(err, result){
	console.log(err, result);
});

steem.api.getContentReplies('jeaimetu', 'upvoting-collection', function(err, result){
	console.log(err, result);
});

//writing reply
var private_posting_wif = process.env.pass;
var parent_author = 'jeaimetu';
var parent_permlink = 're-jeaimetu-6c1klq-stereotype-20180317t185909244z';
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

console.log('getContet test');
steem.api.getContent('jeaimetu','2-happenchange-investing-chapter-2',function(err, result){
	console.log(err, result);
	console.log(result.active_votes[0].voters);
});
*/

/*
console.log('getActiveVotes test');
var res;
var res_formatted = '';;
var pLink = process.env.link;
steem.api.getActiveVotes('jeaimetu',pLink, function(err, result) {
  console.log(err, result);
	console.log('for each test');
	res = result;
	res.forEach((num, index) => {
		console.log(num.voter);
		res_formatted += '\@';
		res_formatted += num.voter;
		res_formatted += '\,';
		});
	console.log(res_formatted);
	
});

*/

console.log('reply retrieve test');
steem.api.getRepliesByLastUpdate('jeaimetu', 're-jeaimetu-6c1klq-stereotype-20180317t185909244z', 10, function(err, result) {
  console.log(err, result);
});

/*

*/
/* this only get main post except replies */
/*
console.log('getDiscussionsByAuthorBeforeDate test');
steem.api.getDiscussionsByAuthorBeforeDate('jeaimetu', '6c1klq-stereotype', "2018-03-18T11:55:18", 10, function(err, result) {
  console.log(err, result);
});
*/




// Create a server that invokes the `handler` function upon receiving a request
http.createServer(handler).listen(process.env.PORT, function(err){
  if(err){
    console.log('Error starting http server');
  } else {
    console.log("Server running at http://127.0.0.1:8000/ or http://localhost:8000/");
  };
});
