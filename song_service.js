var fs = require('fs');
var aliasData = fs.readFileSync('./alias.json');
var songData = fs.readFileSync('./song_urls.json');
var titleData = fs.readFileSync('./titles.json');
var aliases = JSON.parse(aliasData);
var urls = JSON.parse(songData);
var titles = JSON.parse(titleData);
const MAX_MESSAGE_LENGTH = 900

module.exports = {
  getMachineName: function(songName) {
    for (var aliasIdx = 0; aliasIdx < aliases.aliases.length; aliasIdx++) {
      var potentialName = Object.keys(aliases.aliases[aliasIdx])[0];
      var songAliases = aliases.aliases[aliasIdx][potentialName];
      for (var songAliasIdx = 0; songAliasIdx < songAliases.length; songAliasIdx++) {
        // console.log(songAliases[songAliasIdx].toLowerCase())
        // console.log(songName.toLowerCase())
        if (songAliases[songAliasIdx].toLowerCase() === songName.toLowerCase()) {
          return potentialName
        }
      }
    }
    return ""
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

  getAllAliases: function(machineName) {
    var aliasList = [];
    for (var aliasIdx = 0; aliasIdx < aliases.aliases.length; aliasIdx++) {
      var potentialName = Object.keys(aliases.aliases[aliasIdx])[0];
      if (potentialName === machineName) {
        aliasList = aliases.aliases[aliasIdx][potentialName];
      }
    }
    aliasList.push(this.getFriendlyName(machineName));
    return aliasList
  },

  getAllFriendlyNames: function(machineName) {
    var names = []
    var name = "";
    for (var i = 0; i < titles.titles.length; i++) {
      name += titles.titles[i][Object.keys(titles.titles[i])[0]];
      if (name.length >= MAX_MESSAGE_LENGTH) {
        names.push(name);
        name = "";
        continue;
      }
      if (i != titles.titles.length - 1) {
        name += '\n';
      }
    }
    if (name.length > 0) {
      names.push(name);
    }
    return names
  },

  checkAllForName: function(songName) {
    for (var i = 0; i < titles.titles.length; i++) {
      var potentialName = Object.keys(titles.titles[i])[0];
      if (potentialName.toLowerCase() === songName.toLowerCase() ||
          titles.titles[i][potentialName].toLowerCase() === songName.toLowerCase()) {
        return potentialName
      }
    }
    return this.getMachineName(songName)
  }
};