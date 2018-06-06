module.exports = new GulkBuild();

var fs    = require("fs");
var path  = require("path");
var glob  = require("glob");
var util  = require("util");
var juice = require("juice");
var inky = require('inky').Inky;
var cheerio = require('cheerio');
var beautify_html = require('js-beautify').html;

var config  = require('../config');

//Сборка писем
function GulkBuild() {

}

//Запуск сборки
GulkBuild.prototype.run = function run () {
    var templates = this.getTemplates();

    if (templates.length === 0) {
        return console.log("Шаблоны не найдены!");
    }

    //Пускаем в обработку каждый шаблон
    templates.forEach(function (templatePath) {
        this.process(templatePath);
    }.bind(this));
};

//Найти шаблоны
GulkBuild.prototype.getTemplates = function getTemplates() {
    var templateMatch = config.dir.template + '/*.html';
    var templates = glob.sync(templateMatch);

    return templates;
};

//Обработать шаблон
GulkBuild.prototype.process = function process(templatePath) {
    var templateName = path.basename(templatePath, '.html');

    //
    var juiceOpt = {

      preserveMediaQueries: true,

      webResources: {
        relativeTo: config.dir.template
      }
    };

    //
    var htmlFile = fs.readFileSync(templatePath).toString('utf8');

    // Inky
    var i = new inky({});
    var html = cheerio.load(htmlFile)
    var convertedHtml = i.releaseTheKraken(html).html();

    // Juice
    juice.juiceResources(convertedHtml, juiceOpt, function(err, templateHtml) {

      //Готовим шаблон для веб-приложения и теста
      var build = this.build(templateHtml, templateName);
      var production = this.production(templateHtml, templateName);

      build = beautify_html(build, { indent_size: 2 });
      production = beautify_html(production, { indent_size: 2 });

      //Записываем
      fs.writeFileSync(util.format(config.dir.test + '/%s.%s', templateName, 'html'), build, 'utf8');
      fs.writeFileSync(util.format(config.dir.production +'/%s.%s', templateName, config.options.prodFileExtension), production, 'utf8');

      console.log("Сборка завершена: " + templateName);

    }.bind(this));
};

//Письма для теста
GulkBuild.prototype.build = function build(templateHtml, templateName) {

    var re, match;

    //Заполняем тестовыми данными
    var fixture = util.format(config.dir.template + '/%s.json', templateName);

    if (fs.existsSync(fixture)) { // Есть ли фикстура для файла
        fixture = JSON.parse(fs.readFileSync(fixture));
        templateHtml = this.fillFixture(templateHtml, fixture);
    }

    return templateHtml;
};

//Письма для проекта
GulkBuild.prototype.production = function production(templateHtml, templateName) {

    //Расскрываем комментарий
    var patterns = [
        '\n?<!-- !!',
        '!! -->\n?'
    ];

    patterns.forEach(function (pattern) {
        re = new RegExp(pattern, 'g');
        templateHtml = templateHtml.replace(re, '');
    });

    return templateHtml;
};

//Заполняем тестовыми данными
GulkBuild.prototype.fillFixture = function fillFixture(template, fixture) {

    var re, key;

    for (key in fixture) {
        re = new RegExp(key, 'g');
        template = template.replace(re, fixture[key]);
    }

    return template;
};

// Очищаем папку prod и test
GulkBuild.prototype.clearProdAndTest = function clearProdAndTest() {

    var dirs = [
      config.dir.production,
      config.dir.test
    ];

    for (var i = 0; i < dirs.length; i++) {

      var directory = dirs[i]
      clearDir(directory)
    }

    function clearDir(directory) {

        fs.readdir(directory, unlicnkFile);

    }

    function unlicnkFile(err, files) {

        if (err) return false;

        for (var l = 0; l < files.length; l++) {

            var file = files[i];

            fs.unlink(path.join(directory, file), err => {

              if (err) {}
              else { console.log("Directory: " + directory + "cleared!") }

            });
        }
    }
};
