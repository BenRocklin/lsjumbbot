var fs = require('fs');
var aliasData = fs.readFileSync('./alias.json');
var songData = fs.readFileSync('./song_urls.json');
var aliases = JSON.parse(aliasData);
var urls = JSON.parse(songData);

module.exports = {
  getURLs: function(songName, sections) {
    urlList = []
    console.log(urls.songs.altoz[0])
    for (var aliasIdx = 0; aliasIdx < aliases.aliases.length; aliasIdx++) {
      console.log(aliases.aliases[aliasIdx][0]);
    }

    for (x in aliases.aliases) {
      console.log(x);
    }

    for (var sectionIdx = 0; sectionIdx < sections.length; sectionIdx++) {
      section = sections[sectionIdx];
    }
    return "www.google.com"
  }
};