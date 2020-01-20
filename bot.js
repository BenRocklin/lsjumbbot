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

var BOT_VERSION = 0.3

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
  var songRegex = [/^show me/, /^song/, /^caffa pl[sz]/];
  var helpRegex = [/^show me help/, /^help$/];
  var listRegex = [/^show me list/, /^list$/, /^songs$/];
  var infoRegex = [/^info/, /^show me info/];
  var namesRegex = [/^names/, /^name/, /^show me names/];
  var creditsRegex = [/^credits?/];
  
  if (request.sender_type === "bot") {
    console.log("Ignore bot messages.");
    this.res.writeHead(200);
    this.res.end();
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
  if (matchList(helpRegex, reqText.toLowerCase()) != -1) {
    // help menu
    this.res.writeHead(200);
    handleHelp(body, options);
    this.res.end();
  } else if (matchList(listRegex, reqText.toLowerCase()) != -1) {
    // song list
    this.res.writeHead(200);
    handleList(body, options);
    this.res.end();
  } else if (matchList(namesRegex, reqText.toLowerCase()) != -1) {
    // names command
    this.res.writeHead(200);
    handleNames(body, options, reqText);
    this.res.end();
  } else if (matchList(infoRegex, reqText.toLowerCase()) != -1) {
    // info command
    this.res.writeHead(200);
    handleInfo(body, options, reqText);
    this.res.end();
  } else if (coolGuyRegex.test(reqText.toLowerCase())) {
    // cool guy basic bot test/easter egg
    this.res.writeHead(200);
    handleCool(body, options);
    this.res.end();
  } else if (matchList(songRegex, reqText.toLowerCase()) != -1) {
    // song request
    this.res.writeHead(200);
    handleSong(body, options, reqText, sectionRequest);
    this.res.end();
  } else {
    console.log("No match for " + reqText);
    this.res.writeHead(200);
    this.res.end();
  }
}

function getSongCommandSections(songCommand) {
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
  if (/^[Ss]how me info*/.test(songCommand) || /^[Ss]how me names*/.test(songCommand)) {
    numBeginRemove = 3;
  } else if (/^[Ss]how me*/.test(songCommand) || /^[Cc]affa pl[sz]*/.test(songCommand)) {
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

  var machineName = songService.checkAllForName(songName);
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
        if (sectionUrls.length > 1) {
          body.text = "Here's the " + section + " chart for " + friendlyName + " (" + (j + 1) + "/" + sectionUrls.length + ")";
        }
        body.attachments = [{
          "type" : "image",
          "url" : sectionUrls[j]
        }]
        postMessage(body, options);
        wait(7000);
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
  helpText += "                    LSJUMBot v" + BOT_VERSION + "\n";
  helpText += "|||||||||||||||||||||||||||||||||||||||||||||||||||||\n";
  helpText += "Commands:\n";
  helpText += "_______________________________________\n";
  helpText += "\'Help\' to access the help menu\n";
  helpText += "\'Info\' to understand more about any command\n";
  helpText += "\'Song\' to get the song for the given sections\n";
  helpText += "\'List\' to get all songs the bot contains\n";
  helpText += "\'Names\' to find alternate song names\n";
  helpText += "\'Credits\' for all bot credits\n";
  helpText += "_______________________________________\n";
  helpText += "On the way:\n";
  helpText += "_______________________________________\n";
  helpText += "\'Info [command]\' to get additional information on the command\n";
  helpText += "\'Canonical <date>\' to get the canonical for the date\n";
  helpText += "\'Show me a surprise <sections>\' to get a random song\n";
  helpText += "...and more!";


  body.text = helpText;
  postMessage(body, options);
}

function handleList(body, options) {
  nameList = songService.getAllFriendlyNames();
  for (var i = 0; i < nameList.length; i++) {
    body.text = nameList[i];
    postMessage(body, options);
    wait(7000);
  }
}

function handleNames(body, options, reqText) {
  var songName = getSongName(reqText, 0);
  console.log(songName);
  var machineName = "";
  // try to find either machine title, alias, or friendly name
  machineName = songService.checkAllForName(songName);
  if (machineName === "") {
    body.text = "Sorry, we could not find the song named " + songName;
    postMessage(body, options);
  }

  // return all alias
  var alias = songService.getAllAliases(machineName);
  body.text = "All names for " + songName + " are listed below and are case-insensitive:\n" + alias.join("\n");
  postMessage(body, options);
}

function handleInfo(body, options, reqText) {
  var commandName = getSongName(reqText, 0).toLowerCase();
  var mainName, syntax, description, inputs;
  if (commandName === "" || matchList(infoRegex, commandName) != -1) {
    // info command
    mainName = "Info";
    syntax = "Info <command>\nShow me info <command>";
    description = "Provides additional info for the requested command. If <command> is left blank, will show info about the \'Info\' command.";
    inputs = "<command> - The name of the command to find info of, if given. If not, the command \'Info\' is chosen by default."
  } else if (matchList(helpRegex, commandName) != -1) {
    // help command
    mainName = "Help";
    syntax = "Help\nShow me help";
    description = "Shows the help menu";
  } else if (matchList(listRegex, commandName) != -1) {
    // list command
    mainName = "List";
    syntax = "List\nSongs\nShow me list";
    description = "Lists all songs currently present in the chartbot. Combine this with the `'Names`' command to get all names for the songs returned.";
  } else if (matchList(namesRegex, commandName) != -1) {
    // names command
    mainName = "Names";
    syntax = "Names <song>\nName <song>\nShow me names <song>";
    description = "Shows all the (case-insensitive) names for a given song. Any of these may be used as the song title for the `'Song`' command.";
    inputs = "<song> - The name of the song to find alternate names for. Those struggling to find a name should use the `'List`' command to see one name for each song.";
  } else if (matchList(songRegex, commandName) != -1) {
    // song command
    mainName = "Song";
    syntax = "Song <song> <sections>\nCaffa pls <song> <sections>\nShow me <song> <sections>";
    description = "Fetches the song for each section. Only one song may be inputted. However, multiply sections may be optionally specified separated by spaces.";
    inputs = "<song> - The name of the song to find a chart for. Use `'Names`' for a full list of possible names for a song.\n";
    inputs += "<sections> - The sections to get the chart for separated by spaces. If left blank, auto-detects the section of the current user. Acceptable sections include `'Altoz`', `'Bonz`', `'CPG`', `'Mellz`', `'Tenrz`', `'Toobz`', and `'Trumpz`'.";
  } else if (matchList(creditsRegex, commandName) != -1) {
    // credits command
    mainName = "Credits";
  } else {
    body.text = "Sorry, we could not find the command " + commandName;
    postMessage(body, options);
  }

  body.text = "Command: " + mainName + "\n";
  body.text += "Invocation:\n";
  body.text += syntax + "\n";
  body.text += "_______________________________________\n"
  body.text += "Description: " + description + "\n";
  if (inputs) {
    body.text += "Inputs:\n" + inputs;
  }
  console.log(body.text.length);
  postMessage(body, options);

}

function handleCredits(body, options) {
  body.text = "";
  postMessage(body, options);
}

function handleCool(body, options) {
  body.text = cool();
  postMessage(body, options);
}

function postMessage(body, options) {
  var botResponse = body.text;
  console.log('sending ' + botResponse + ' to ' + body["bot_id"]);

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