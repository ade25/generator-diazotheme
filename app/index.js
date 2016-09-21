'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');

var DiazothemeGenerator = module.exports = function DiazothemeGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.on('end', function() {
    this.npmInstall();
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
      default: true
    }
  ];

  this.prompt(prompts, function(props) {
    this.themeName = props.themeName;
    this.diazoTheme = props.diazoTheme;

    cb();
  }.bind(this));
};

DiazothemeGenerator.prototype.app = function app() {
  this.directory('src/', 'app/');
  this.directory('layouts/', 'app/_layouts/');
  this.directory('includes/components', 'app/_includes/components');
  this.directory('includes/layout', 'app/_includes/layout');
  this.mkdir('app/_includes/base');
  this.template('includes/base/head.html', 'app/_includes/base/head.html');
  this.template('includes/base/javascript.html', 'app/_includes/base/javascript.html');
  this.copy('includes/base/piwik.html', 'app/_includes/base/piwik.html');
  this.copy('includes/base/webfonts.html', 'app/_includes/base/webfonts.html');
  this.directory('overrides/', 'overrides/');
  this.mkdir('app/scripts');
  this.copy('main.js', 'app/scripts/main.js');
  this.copy('app.js', 'app/scripts/app.js');
  this.copy('gulpfile.js', 'gulpfile.babel.js');
  this.copy('Gruntfile.js', 'Gruntfile.js');
  this.copy('Makefile', 'Makefile');
  this.copy('README.md', 'README.md');
  this.template('_config.json', 'config.json');
  this.template('_config.yml', '_config.yml');
  this.template('_package.json', 'package.json');
};

DiazothemeGenerator.prototype.projectfiles = function projectfiles() {
  this.copy('babelrc', '.babelrc');
  this.copy('gitignore', '.gitignore');
  this.copy('editorconfig', '.editorconfig');
  this.copy('jshintrc', 'app/scripts/.jshintrc');
  this.copy('jscsrc', 'app/scripts/.jscsrc');
};

DiazothemeGenerator.prototype.patterns = function patterns() {
  if (this.diazoTheme) {
    this.template('_manifest.cfg', 'manifest.cfg');
    this.copy('rules.xml', 'rules.xml');
  }
};
