// Load the http module to create an http server.
var http = require('http'); 
var steem = require('steem');
var store = require('data-store')('my-app');
var sleep = require('sleep');

var tarot = require('./tarot.js');

var cloudinary = require('cloudinary');

cloudinary.config({
	cloud_name: process.env.cloud_name,
	api_key: process.env.api_key,
	api_secret: process.env.api_secret
});

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

*/

//After writing, this needs cool down time to create the block chain
function writingReply(child_permlink,pAuthor){
	var private_posting_wif = process.env.pass;
	var parent_author = pAuthor;
	//var parent_author = '';
	var parent_permlink = child_permlink;
	var json_metadata = '';
	//check author have . then remove that
	var parent_author_permlink = pAuthor;
	var dotCheck = ".";
	if(pAuthor.indexOf(dotCheck) != -1){
		//replace .
		var parent_author_permlink = pAuthor.replace(".","dot");
	}

	const permlink = steem.formatter.commentPermlink(parent_author_permlink, parent_permlink)
	//const permlink = steem.formatter.commentPermlink('jeaimetu', parent_permlink)
	var tarotResult = tarot.randomCard();
	var i = tarotResult.indexOf("##: ");
	var a = tarotResult.substr(i+4,tarotResult.length-1);
	a.replace(/\s/g,'');
	console.log("image name :", a,":");
	var b = tarotResult.substr(0,i-1);
	
	var content = '<table><tr><td>  ';
	//content += cloudinary.image("00_Fool.jpg", {alt : "Test"})
	console.log(cloudinary.image(a, {alt : "Test"}));
	//content += cloudinary.image(a, {alt : "Test"}, {width : 50})
	content += cloudinary.image(a, {width : 100, height : 200, crop : 'fit' })
	content += '</td><td><p><strong>안녕하세요. 타로점 결과 입니다. 많이 사용해 주세요.</strong></p><hr><p>';
	
	//content += tarot.randomCard();
	b = b.replace("/","/\n");
	content += b;
	content += '</td></tr></table>';
	
	steem.broadcast.comment (
    	private_posting_wif,  // Steemit.com Wallet -> Permissions -> Show Private Key (for Posting)
    	parent_author,        // empty for new blog post 
    	parent_permlink,      // main tag for new blog post
    	'jeaimetu',               // same user the private_posting_key is for
    	permlink,             // a slug (lowercase 'a'-'z', '0'-'9', and '-', min 1 character, max 255 characters)
    	'',                // human-readable title
    	content,                 // body of the post or comment
    	json_metadata,          // arbitrary metadata
		function (err, result){
			if(err)
				console.log('Failure', err);
			else
				console.log('Success');
		}
		);
		
}

function checkReplies() {
	steem.api.getContentReplies('jeaimetu', process.env.link, function(err, result){
		//console.log(err, result);
		result.forEach((num, idx)=> {
			//sleep.sleep(21); //do not work what I intended
			console.log(num.body);
			if(num.children == 0){
				var string = "타로";
				if(num.body.indexOf(string) != -1){
					console.log('I will make reply for this');
					console.log('call writingReply for ', idx);
					writingReply(num.permlink, num.author);
				}
			}
		});
	});
}

// according to steemit github
// https://github.com/steemit/steem/blob/master/libraries/protocol/include/steemit/protocol/config.hpp
// #define STEEMIT_MIN_REPLY_INTERVAL              (fc::seconds(20)) // 20 seconds
// So I safely add 60secs interval consider delay time.
setInterval(checkReplies, 25000);


async function getFullAccountHistory(){
	const end = 9999 * 5;
	const step = 9999;
	for(let start = 99999999;start >= step;start -= step){
		result = await steem.api.getAccountHistoryAsync("jeaimetu", start, step);
		console.log(result);
	}
	return result;
}

getFullAccountHistory().then(v => {
	console.log(v);
});

/* ToDo
1. get more than 9999 records
2. extract number from "x.xxx STEEM" and convert it to number
*/
//do {
/*
async function getFullAccountHistory(){
	const end = 9999 * 10;
	const step = 9999;
	var amount = 0;
	for(let start = 0; start < end;start += step) {
		await steem.api.getAccountHistoryAsync('jeaimetu', start, step).each((history: any[]) => {
			const result = history;
		}
		//console.log(err, result);
		const WALLET_FILTER = 'transfer'
		let transfers = result.filter( tx => tx[1].op[0] === WALLET_FILTER )
    	//console.log(transfers)
		
	
		transfers.forEach((tx) => {
			if(tx[1].op[1].from == "upbit-exchange" || tx[1].op[1].from == "korbit2" || tx[1].op[1].from == "gopax"){
				console.log(tx[1].op[0], tx[1].op[1].from, tx[1].op[1].amount)
				let money = tx[1].op[1].amount.split(" ");
				amount += parseInt(money[0],10);}
		}
	
		console.log("total amount from exchange", amount);
	
		if(result.length < 1)
			return;
	});

	} //end of for
//} while(result.length != 0)
} //end of async function
*/
//did not return all images. This may depends on the folder
//cloudinary.v2.api.resources(function(error, result){console.log(result)});
//did not return nothing
//cloudinary.v2.api.resources({type: 'upload'}, function(error, result){});
cloudinary.v2.search.expression("*00_Fool.jpg").execute(function(error, result) {
	console.log("cloudinary fool search");
	console.log(result)});

//getFullAccountHistory();
/* data store test 
store.set('a','test string');
console.log(store.get('a'));
*/
/*


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
/* this get all replies, so does not work for me */
/*
console.log('reply retrieve test');
steem.api.getRepliesByLastUpdate('jeaimetu', 're-jeaimetu-6c1klq-stereotype-20180317t185909244z', 10, function(err, result) {
  console.log(err, result);
});
*/
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
