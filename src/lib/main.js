var GulkCLI   = require('./cli.js');
var gulkBuild = require('./tasks/build');
var gulkSend  = require('./tasks/send');
var gulkWatch  = require('./tasks/watch');

var cliCommands = {
  build: function() {
    gulkBuild.run();
  },
  clear: function() {
    gulkBuild.clearProdAndTest();
  },
  setEmailPass: function() {

    cli.password(function(err, password) {

      if (err) return;
      gulkSend.setEmailPass(password);

    });

  },
  send: function() {
    gulkSend.run();
  },
  watch: function() {
    gulkWatch.run();
  },
  nowatch: function() {
    gulkWatch.stop();
  }
};

cli = new GulkCLI(cliCommands);
cli.start();
