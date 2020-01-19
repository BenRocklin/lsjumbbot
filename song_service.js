var fs = require('fs');
var data = fs.readFileSync('./song_urls.json');
var url = JSON.parse(data);

module.exports = {
  getURL: function(songName, sections) {
    console.log(url.songs.altoz[0])
    return "www.google.com"
  }
};