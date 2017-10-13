'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');

'use strict';
const Generator = require('yeoman-generator');
const commandExists = require('command-exists').sync;
const yosay = require('yosay');
const chalk = require('chalk');
const mkdirp = require('mkdirp');
const _s = require('underscore.string');


module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.option('skip-welcome-message', {
      desc: 'Skips the welcome message',
      type: Boolean
    });

    this.option('test-framework', {
      desc: 'Test framework to be invoked',
      type: String,
      defaults: 'mocha'
    });

    this.option('babel', {
      desc: 'Use Babel',
      type: Boolean,
      defaults: true
    });
  }

  initializing() {
    this.pkg = require('../package.json');
    this.composeWith(
      require.resolve(`generator-${this.options['test-framework']}/generators/app`),
      { 'skip-install': this.options['skip-install'] }
    );
  }

  prompting() {
    if (!this.options['skip-welcome-message']) {
      this.log(yosay('\'Allo \'allo! I will build a theme resource directory now. Out of the box I include a gulpfile to build your app.'));
    }
    return this.prompt([{
      type    : 'input',
      name    : 'name',
      message : 'Your project name',
      default : this.appname // Default to current folder name
    }
  }

  writing() {
    this._writingGulpfile();
   // this._writingPackageJSON();
   // this._writingBabel();
   // this._writingGit();
   // this._writingBower();
   // this._writingEditorConfig();
   // this._writingH5bp();
   // this._writingStyles();
   // this._writingScripts();
   // this._writingHtml();
   // this._writingMisc();
  }

  _writingGulpfile() {
    this.fs.copyTpl(
      this.templatePath('gulpfile.js'),
      this.destinationPath('gulpfile.babel.js'),
      {
        date: (new Date).toISOString().split('T')[0],
        name: this.pkg.name,
        version: this.pkg.version,
        includeBabel: this.options['babel'],
        testFramework: this.options['test-framework']
      }
    );
  }

};


var DiazothemeGenerator = module.exports = function DiazothemeGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.on('end', function() {
    this.yarnInstall();
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
  // this.copy('includes/base/webfonts.html', 'app/_includes/base/webfonts.html');
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
