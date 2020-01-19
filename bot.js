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
        return i;
    }
    
  }
  return -1;
}

function respond() {
  var request = JSON.parse(this.req.chunks[0]);
  var coolGuyRegex = /^\/cool guy$/;
  var songRegex = [/^[Ss]how me*/, /^[Ss]ong*/, /^[Cc]affa pl[sz]*/];
  var helpRegex = [/^[Ss]how me help*/, /^[Hh]elp$/]
  
  if (request.sender_type === "bot") {
    console.log("Ignore bot messages.");
    return
  }
  console.log(request);

  console.log("Finding group...");
  var id = botID;
  var sectionRequest = "";
  switch(request.group_id) {
    case '53713952':
      console.log("Test");
      break;
    case '56932897':
      console.log("Altoz");
      id = botIDAltoz
      sectionRequest = "altoz";
      break;
    case '56932898':
      console.log("Bonz");
      id = botIDBonz
      sectionRequest = "bonz";
      break;
    case '56932899':
      console.log("CPG");
      id = botIDCpg
      sectionRequest = "cpg";
      break;
    case '56932901':
      console.log("Mellz");
      id = botIDMellz
      sectionRequest = "mellz";
      break;
    case '56932902':
      console.log("Tenrz");
      id = botIDTenrz
      sectionRequest = "tenrz";
      break;
    case '56932903':
      console.log("Toobz");
      id = botIDToobz
      sectionRequest = "toobz";
      break;
    case '56932904':
      console.log("Trumpz");
      id = botIDTrumpz
      sectionRequest = "trumpz";
      break;
    default:
      console.log("UNKNOWN");
  }

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
    "bot_id" : id,
    "text" : "",
    "attachments" : []
  };

  var reqText = request.text
  if (matchList(helpRegex, reqText) != -1) {
    this.res.writeHead(200);
    handleHelp(body, options);
    this.res.end();
  } else if (matchList(songRegex, reqText) != -1) {
    this.res.writeHead(200);
    handleSong(body, options, reqText, sectionRequest);
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

function getSongCommandSections(songCommand, nativeSection) {
  var sections = [];
  var splitText = songCommand.toLowerCase().split(' ');
  if (splitText.length > 0) {
    for (var i = splitText.length - 1; i >= 0; i--) {
      if (["altoz", "bonz", "cpg", "mellz", "tenrz", "toobz", "trumpz"].indexOf(splitText[i]) >= 0) {
        sections.push(splitText[i]);
      }
    }
  }
  return sections
}

function getSongName(songCommand, numSections) {
  var splitText = songCommand.split(' ');
  if (/^[Ss]how me*/.test(songCommand) || /^[Cc]affa pl[sz]*/.test(songCommand)) {
    numBeginRemove = 2;
  } else {
    numBeginRemove = 1;
  }
  splitText = splitText.slice(numBeginRemove);
  if (numSections != 0) {
    splitText.splice(-numSections);
  }
  return splitText.join(' ');
}

function getUnique(list) {
  var keys = {};
  list.forEach(function(i) {
    if (!keys[i]) {
      keys[i] = true;
    }
  });
  return Object.keys(keys);
}

function wait(ms) {
  var start = Date.now();
  var now = start;
  while (now - start < ms) {
    now = Date.now();
  }
}

function handleSong(body, options, songCommand, nativeSection) {
  // section and song name setup
  var sections = getSongCommandSections(songCommand, nativeSection);
  var songName = getSongName(songCommand, sections.length);
  if (nativeSection === "" && sections.length == 0) {
    sections = ["altoz", "bonz", "cpg", "mellz", "tenrz", "toobz", "trumpz"];
  } else if (sections.length == 0) {
    sections = [nativeSection];
  }
  sections = getUnique(sections)

  var machineName = songService.getMachineName(songName);
  console.log("MACHINE: " + machineName);
  var friendlyName = songService.getFriendlyName(machineName);
  console.log("FRIENDLY: " + friendlyName);
  var urls = songService.getURLs(machineName, sections);
  console.log(urls);
  for (var i = 0; i < sections.length; i++) {
    section = sections[i];
    if (section in urls) {
      console.log(urls[section])
      body.text = "Here's the " + section + " chart for " + friendlyName;
      sectionUrls = urls[section];
      for (var j = 0; j < sectionUrls.length; j++) {
        if (sectionUrls.length > 0) {
          body.text = "Here's the " + section + " chart for " + friendlyName + " (" + (j + 1) + "/" + sectionUrls.length + ")";
        }
        body.attachments = [{
          "type" : "image",
          "url" : sectionUrls[j]
        }]
        postMessage(body, options);
        wait(5000);
      }
    } else {
      console.log(section + " failure")
      body.text = "Sorry, we could not find the " + section + " chart for " + songName;
      postMessage(body, options);
    }
  }
}

function handleHelp(body, options) {
  var helpText = "|||||||||||||||||||||||||||||||||||||||||||||||||||||\n";
  helpText += "                    LSJUMBot v0.2                    \n";
  helpText += "|||||||||||||||||||||||||||||||||||||||||||||||||||||\n";
  helpText += "Active Commands:\n";
  helpText += "_____________________________________________________\n";
  helpText += "\'Help\' to access the help menu."
  helpText += "\'Song <song> <sections>\' to get the song for the given sections."
  helpText += "_____________________________________________________\n";
  helpText += "Inactive Commands:\n";
  helpText += "_____________________________________________________\n";


  body.text = helpText;
  postMessage(body, options);
}

function handleCool(body, options) {
  body.text = cool();
  postMessage(body, options);
}

function postMessage(body, options) {
  var botResponse = body.text;
  console.log('sending ' + botResponse + ' to ' + body.id);

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