module.exports = CLI;

var promptly = require('promptly');

function CLI(commands) {
    var cli = this;

    commands = commands || {};

    this.commands = {
        'exit': function () {
            cli.exit();
        }
    };

    for (var key in commands) {
        this.commands[key] = commands[key];
    }
}

CLI.prototype.start = function start() {
    this.prompt();
};

CLI.prototype.output = function output(string) {
    console.log(string);
};

CLI.prototype.prompt = function prompt(guest) {
    var cli = this;
    guest = guest || '>';

    promptly.prompt(guest, function (err, value) {

        value = value.split(' ');

        cmd = value[0];
        params = value.slice(1);

        if (cli.commands[cmd]) {
            cli.commands[cmd](params);
        } else {
            cli.output('Команда не опознана');
        }

        if (cmd !== 'setEmailPass') {
          cli.prompt();
        }

    });
};

CLI.prototype.password = function password(callback = function() {}) {

    promptly.password('Введите пароль: ', function (err, value) {
        callback(err, value)
        cli.prompt();
    });

};


CLI.prototype.exit = function exit() {
    this.output("Ты заходи, если что!..");
    process.exit();
};
