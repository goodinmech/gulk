module.exports = new GulkSend();

var fs    = require("fs");
var path  = require("path");
var glob  = require("glob");
var util  = require("util");
var nodemailer = require('nodemailer');

var config = require('../config');

function GulkSend() {

}

GulkSend.prototype.run = function () {
    var templates = this.getTemplates();

    if (templates.length === 0) {
        return console.log("Собранные шаблоны не найдены!");
    }

    templates.forEach(function (templatePath) {
        var templateName = path.basename(templatePath);
        var templateHtml = fs.readFileSync(templatePath).toString();
        this.send(templateName, templateHtml);
    }.bind(this));
};

// Установить пароль email
GulkSend.prototype.setEmailPass = function (password) {
    config.send.smtpTransport.auth.pass = password;
    console.log('Новый пароль установлен')
};

//Найти шаблоны
GulkSend.prototype.getTemplates = function getTemplates() {
    var templateMatch = config.dir.test + '/*.html';
    var templates = glob.sync(templateMatch);

    return templates;
};

//Отправка письма
GulkSend.prototype.send = function (subject, body) {

    var transporter = nodemailer.createTransport(config.send.smtpTransport);

    var mailOptions = {
        from: config.send.sendFrom,
        to: config.send.sendTo.join(', '),
        subject: subject,
        html: body
    };

    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }
        console.log(subject+ ' send: ' + info.response);
    });
};
