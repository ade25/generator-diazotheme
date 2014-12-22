# Compiling theme components

This theme project uses the Grunt task-runner as a build system to compile a production ready distribution.

## Available Grunt commands


### grunt dev (Just compile CSS and JavaScript)

- compile less files to css
- concat javascript resources
- build html theme templates

### grunt dist (Build production ready distribution)

Regenerates the /dist/ directory with compiled and minified CSS and JavaScript files and builds the index files via Jekyll task. 


### grunt watch (Watch)

Watches the Less source files and automatically recompiles them to CSS whenever you save a change.

### grunt test (Run tests)

Runs JSHint and runs the QUnit tests headlessly in PhantomJS.
grunt docs (Build & test the docs assets)

Builds and tests CSS, JavaScript, and other assets which are used when running the documentation locally via jekyll serve.

### grunt (Build absolutely everything and run tests)

Compiles and minifies CSS and JavaScript, builds the documentation website, runs the HTML5 validator against the docs, regenerates the Customizer assets, and more. Requires Jekyll. Usually only necessary if you're hacking on Bootstrap itself.


## Troubleshooting

Should you encounter problems with installing dependencies or running Grunt commands, first delete the /node_modules/ directory generated by npm. Then, rerun npm install.