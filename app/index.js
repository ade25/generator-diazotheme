'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');

var DiazothemeGenerator = module.exports = function DiazothemeGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.on('end', function() {
    this.installDependencies({skipInstall: options['skip-install']});
  });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(DiazothemeGenerator, yeoman.generators.Base);

DiazothemeGenerator.prototype.askFor = function askFor() {
  var cb = this.async();
  // have Yeoman greet the user.
  console.log(this.yeoman);
  var prompts = [
    {
      name: 'themeName',
      message: 'What would you like to name your theme?'
    },
    {
      type: 'confirm',
      name: 'diazoTheme',
      message: 'Are you creating a Diazo theme?',
      default: false
    }
  ];

  this.prompt(prompts, function(props) {
    this.themeName = props.themeName;
    this.diazoTheme = props.diazoTheme;

    cb();
  }.bind(this));
};

DiazothemeGenerator.prototype.app = function app() {
  this.directory('layouts/', '_layouts/');
  this.directory('includes/', '_includes/');
  this.directory('assets/', 'assets/');
  this.directory('sass/', 'sass/');
  this.directory('overrides/', 'overrides/');
  this.mkdir('js');
  this.copy('main.js', 'js/main.js');
  this.copy('Gruntfile.js', 'Gruntfile.js');
  this.copy('Makefile', 'Makefile');
  this.copy('README.md', 'README.md');
  this.template('index.html', 'index.html');
  this.template('signin.html', 'signin.html');
  this.template('_bower.json', 'bower.json');
  this.template('_config.json', 'config.json');
  this.template('_config.yml', '_config.yml');
  this.template('_package.json', 'package.json');
};

DiazothemeGenerator.prototype.projectfiles = function projectfiles() {
  this.copy('bowerrc', '.bowerrc');
  this.copy('gitignore', '.gitignore');
  this.copy('editorconfig', '.editorconfig');
  this.copy('jshintrc', 'js/.jshintrc');
  this.copy('jscsrc', 'js/.jscsrc');
};

DiazothemeGenerator.prototype.patterns = function patterns() {
  if (this.diazoTheme) {
    this.template('_manifest.cfg', 'manifest.cfg');
    this.copy('rules.xml', 'rules.xml');
  }
};
