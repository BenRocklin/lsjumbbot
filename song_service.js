var fs = require('fs');
var data = fs.readFileSync('./song_urls.json');
var url = JSON.parse(data);
