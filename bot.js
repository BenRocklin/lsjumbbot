var HTTPS = require('https');
var cool = require('cool-ascii-faces');
var songService = require('./song_service.js')

var botID = process.env.TEST_BOT_ID;

function matchList(regexList, query) {
  for (var i = 0; i < regexList.length; i++) {
    if (regexList[i].test(query)) {
        console.log(query + " matched " + regexList[i]);
        return true;
    }
    
  }
  return false;
}

function respond() {
  var request = JSON.parse(this.req.chunks[0]);
  var coolGuyRegex = /^\/cool guy$/;
  var songRegex = [/^[Ss]how me */, /^[Ss]ong */, /^[Cc]affa pl[sz] */];
  
  console.log(request);

  if(request.text && coolGuyRegex.test(request.text)) {
    this.res.writeHead(200);
    postMessage();
    this.res.end();
  } else {
    
    console.log("don't care");
    this.res.writeHead(200);
    this.res.end();
  }
}

function postMessage() {
  var botResponse, options, body, botReq;

  botResponse = cool();

  options = {
    hostname: 'api.groupme.com',
    path: '/v3/bots/post',
    method: 'POST'
  };

  body = {
    "bot_id" : botID,
    "text" : botResponse
  };

  console.log('sending ' + botResponse + ' to ' + botID);

  botReq = HTTPS.request(options, function(res) {
      if(res.statusCode == 202) {
        //neat
      } else {
        console.log('rejecting bad status code ' + res.statusCode);
      }
  });

  botReq.on('error', function(err) {
    console.log('error posting message '  + JSON.stringify(err));
  });
  botReq.on('timeout', function(err) {
    console.log('timeout posting message '  + JSON.stringify(err));
  });
  botReq.end(JSON.stringify(body));
}


exports.respond = respond;