var fs = require('fs');
var aliasData = fs.readFileSync('./alias.json');
var songData = fs.readFileSync('./song_urls.json');
var aliases = JSON.parse(aliasData);
var urls = JSON.parse(songData);

module.exports = {
  getURLs: function(songName, sections) {
    urlList = []
    console.log(urls.songs.altoz[0])
    for (var aliasIdx = 0; aliasIdx < aliases.aliases.length; i++) {
      console.log(aliases.aliases[i]);
    }

    for (var sectionIdx = 0; sectionIdx < sections.length; sectionIdx++) {
      section = sections[i];
    }
    return "www.google.com"
  }
};