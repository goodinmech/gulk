module.exports = new GulkWatch();

var fs    = require("fs");
var path  = require("path");
var glob  = require("glob");
var util  = require("util");
var watch  = require("watch");

var gulkBuild = require('./build');
var config = require('../config');

function GulkWatch() {

}

GulkWatch.prototype.run = function () {
    var templateDir = config.dir.template;

    watch.watchTree(templateDir, function (f, curr, prev) {
      if (typeof f == "object" && prev === null && curr === null) {
        console.log('watcher launched');
      } else {
        gulkBuild.run();
      }
   });
};

GulkWatch.prototype.stop = function () {
    var templateDir = config.dir.template;
    watch.unwatchTree(templateDir);
    console.log('watcher stopped');
};
