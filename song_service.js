var fs = require('fs');
var data = fs.readFileSync('./song_urls.json');
var url = JSON.parse(data);

module.exports = {
  getURL: function(songName) {
    console.log(url)
    return "www.google.com"
  }
};