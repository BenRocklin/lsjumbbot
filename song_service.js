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
    console.log(titles.titles);
    console.log(machineName)
    for (var i = 0; i < titles.titles.length; i++) {
      var potentialName = Object.keys(titles.titles[i])[0];
      if (potentialName === machineName) {
        return titles.titles[i][potentialName];
      }
    }
    return machineName
  },
  
  getURLs: function(machineName, sections) {
    var urlList = [];
    for (var sectionIdx = 0; sectionIdx < sections.length; sectionIdx++) {
      section = sections[sectionIdx];
      urlListSection = urls.songs[section];
      for (var i = 0; i < urlListSection.length; i++) {
        if (urlListSection[i]["title"] === machineName) {
          urlList = urlList.concat(urlListSection[i]["urls"]);
        }
      }
    }
    return urlList
  }
};