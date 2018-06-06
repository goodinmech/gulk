var fs = require('fs');
var path = require('path');
var configPath = path.join(__dirname, '/../../config.json');

var config = fs.readFileSync(configPath);
config = JSON.parse(config);

module.exports = config;
