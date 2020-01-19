var fs = require('fs');
var data = fs.readFileSync('./song_urls.json');
var url = JSON.parse(data);

module.exports = {
  getURLs: function(songName, sections) {
    console.log(url.songs.altoz[0])
    console.log(songName)
    console.log(sections)
    for (var section in sections) {
      console.log(section)
    }
    return "www.google.com"
  }
};