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
      console.log(aliases.aliases[aliasIdx])
      console.log(potentialName)
      console.log(Object.values(aliases.aliases[aliasIdx]));
    }

    var urlList = [];
    for (var sectionIdx = 0; sectionIdx < sections.length; sectionIdx++) {
      section = sections[sectionIdx];
    }
    return "www.google.com"
  }
};