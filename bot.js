var HTTPS = require('https');
var cool = require('cool-ascii-faces');
var songService = require('./song_service.js')

var botID = process.env.TEST_BOT_ID;
var botIDAltoz = process.env.BOT_ID_ALTOZ;
var botIDBonz = process.env.BOT_ID_BONZ;
var botIDCpg = process.env.BOT_ID_CPG;
var botIDMellz = process.env.BOT_ID_MELLZ;
var botIDTenrz = process.env.BOT_ID_TENRZ;
var botIDToobz = process.env.BOT_ID_TOOBZ;
var botIDTrumpz = process.env.BOT_ID_TRUMPZ;

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
  var songRegex = [/^[Ss]how me*/, /^[Ss]ong*/, /^[Cc]affa pl[sz]*/];
  
  console.log(request);
  var id = botID;
  var sectionRequest = "";
  console.log(request.group_id);

  if (!request.text) {
    console.log("No txt");
    this.res.writeHead(200);
    this.res.end();
    return
  }

  options = {
    hostname: 'api.groupme.com',
    path: '/v3/bots/post',
    method: 'POST'
  };

  body = {
    "bot_id" : botID,
    "text" : ""
  };

  reqText = request.text
  if (matchList(songRegex, reqText)) {
    this.res.writeHead(200);
    handleSong(body, options, reqText);
    this.res.end();
  } else if (coolGuyRegex.test(reqText)) {
    this.res.writeHead(200);
    handleCool(body, options);
    this.res.end();
  } else {
    console.log("No match for " + reqText);
    this.res.writeHead(200);
    this.res.end();
  }
}

function handleSong(body, options, songCommand, nativeSection) {
  songService.getURL(songCommand, "Trumpz");
}

function handleCool(body, options) {
  body.text = cool();
  postMessage(body, options);
}

function postMessage(body, options) {
  var botResponse = body.text;
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