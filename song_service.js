var fs = require('fs');
var aliasData = fs.readFileSync('./alias.json');
var songData = fs.readFileSync('./song_urls.json');
var titleData = fs.readFileSync('./titles.json');
var aliases = JSON.parse(aliasData);
var urls = JSON.parse(songData);
var titles = JSON.parse(titleData);

module.exports = {
  getMachineName: function(songName) {
    var machineName = "";
    for (var aliasIdx = 0; aliasIdx < aliases.aliases.length; aliasIdx++) {
      var potentialName = Object.keys(aliases.aliases[aliasIdx])[0];
      var songAliases = aliases.aliases[aliasIdx][potentialName];
      for (var songAliasIdx = 0; songAliasIdx < songAliases.length; songAliasIdx++) {
        console.log(songAliases[songAliasIdx].toLowerCase())
        console.log(songName.toLowerCase())
        if (songAliases[songAliasIdx].toLowerCase() === songName.toLowerCase()) {
          machineName = potentialName;
          break;
        }
      }
      if (machineName.length > 0) {
        break;
      }
    }
    return machineName
  },

  getFriendlyName: function(machineName) {
    for (var i = 0; i < titles.titles.length; i++) {
      var potentialName = Object.keys(titles.titles[i])[0];
      if (potentialName === machineName) {
        return titles.titles[i][potentialName];
      }
    }
    return machineName
  },
  
  getURLs: function(machineName, sections) {
    var urlList = {};
    for (var sectionIdx = 0; sectionIdx < sections.length; sectionIdx++) {
      section = sections[sectionIdx];
      urlListSection = urls.songs[section];
      for (var i = 0; i < urlListSection.length; i++) {
        if (urlListSection[i]["title"] === machineName) {
          urlList[section] = urlListSection[i]["urls"];
        }
      }
    }
    return urlList
  },

  getAllFriendlyNames: function(machineName) {
    var names = "";
    for (var i = 0; i < titles.titles.length; i++) {
      names += titles.titles[i][Object.keys(titles.titles[i])[0]];
      if (i != titles.titles.length - 1) {
        names += '\n';
      }
      // if (i == 30) {
      //   break;
      // }
    }
    console.log(names.length)
    return names
  }
};