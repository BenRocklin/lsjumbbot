var fs = require('fs');
var aliasData = fs.readFileSync('./alias.json');
var songData = fs.readFileSync('./song_urls.json');
var aliases = JSON.parse(aliasData);
var urls = JSON.parse(songData);

module.exports = {
  getURLs: function(songName, sections) {
    console.log(urls.songs.altoz[0])
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

    var urlList = [];
    for (var sectionIdx = 0; sectionIdx < sections.length; sectionIdx++) {
      section = sections[sectionIdx];
      urlListSection = urls.songs[section];
      console.log(urlListSection)
    }
    return "www.google.com"
  }
};