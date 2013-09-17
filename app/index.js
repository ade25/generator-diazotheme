'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');


var DiazothemeGenerator = module.exports = function DiazothemeGenerator(args, options, config) {
    yeoman.generators.Base.apply(this, arguments);

    this.on('end', function () {
        this.installDependencies({ skipInstall: options['skip-install'] });
    });

    this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(DiazothemeGenerator, yeoman.generators.Base);

DiazothemeGenerator.prototype.askFor = function askFor() {
    var cb = this.async();
    // have Yeoman greet the user.
    console.log(this.yeoman);
    var prompts = [{
        name: 'themeName',
        message: 'What would you like to name your theme?'
    }];

    this.prompt(prompts, function (props) {
        this.themeName = props.themeName;

        cb();
    }.bind(this));
};

DiazothemeGenerator.prototype.app = function app() {
    this.directory('layouts/', '_layouts/');
    this.directory('includes/', '_includes/');
    this.mkdir('js');
    this.copy('main.js', 'js/main.js');
    this.mkdir('less');
    this.copy('settings.less', 'less/settings.less');
    this.copy('application.less', 'less/application.less');
    this.template('styles.less', 'less/styles.less');
    this.mkdir('overrides');
    this.template('overrides-readme.md', 'overrides/README.md');
    this.copy('rules.xml', 'rules.xml');
    this.template('_manifest.cfg', 'manifest.cfg');
    this.copy('Gruntfile.js', 'Gruntfile.js');
    this.template('index.html', 'index.html');
    this.template('_bower.json', 'bower.json');
    this.template('_config.json', 'config.json');
    this.template('_package.json', 'package.json');
};

DiazothemeGenerator.prototype.projectfiles = function projectfiles() {
    this.copy('bowerrc', '.bowerrc');
    this.copy('gitignore', '.gitignore');
    this.copy('editorconfig', '.editorconfig');
    this.copy('jshintrc', '.jshintrc');
};
