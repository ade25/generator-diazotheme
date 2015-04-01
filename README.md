# generator-diazotheme

[Yeoman](http://yeoman.io) generator that scaffolds out a front-end theme directory.

## Features

* CSS Autoprefixing
* Built-in preview server with LiveReload
* Automagically compile LESS, JS
* Automagically lint your scripts
* Automagically wire up your Bower components
* Awesome Image Optimization (via OptiPNG, pngquant, jpegtran and gifsicle)
* Jekyll template generation
* Cache busting for production use
* Integration with `plone.app.theming` via replacement parts


## Getting Started

### What is Yeoman?

Yeoman lives in the [npm](https://npmjs.org) package repository. You only have to ask for him once, then he packs up and moves into your hard drive. *Make sure you clean up, he likes new and shiny things.*

#### Install Node/npm (the clean way)

If you intent to do frontend development with `npm`, it is recommended you setup a usable development environment with the help of [nvm](https://github.com/creationix/nvm).

In order to use *nvm* you need to uninstall/remove any previously installed Node/npm versions. Follow the instructions on [npmjs.com](https://docs.npmjs.com/misc/removing-npm) or remove all traces of Node and npm by running the commands found [here](http://stackoverflow.com/questions/11177954/how-do-i-completely-uninstall-node-js-and-reinstall-from-beginning-mac-os-x/11178106#11178106).

Then issue the following command to **install nvm**:

```bash
$ wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.24.0/install.sh | bash
```

Setup the installed **node version manager** by sourcing the setup to your shell:

```bash
$ source ~/.nvm/nvm.sh
```

Note: to make this setting persist, add the source line to your `~/.profile` or `~/.bash_profile`.

**Install Node/NPM:**

Install the latest stable version of **node** (which will include the matching release of **npm**) by running:

```bash
$ nvm install stable
$ nvm alias default stable
```

You can also create a file `~/.nvmrc` in your home folder containing a version number, e.g.`0.12.2` (this should match the desired default node release):

```bash
$ cat ~/.nvmrc
0.12.2
```

After you have installed and setup **npm** just open a Terminal window and install YEOMAN:

```
$ npm install -g yo
```

Done and ready to go!


### Generator Setup/Installation

To install generator-diazotheme from npm, clone this repository and link the
package to your local npm executable:

```
$ git clone git@github.com:ade25/generator-diazotheme.git
$ cd ./generator-diazotheme
$ npm link
```

Finally, initiate the generator:

```
$ yo diazotheme
```

### Getting To Know Yeoman

Yeoman has a heart of gold. He's a person with feelings and opinions, but he's very easy to work with. If you think he's too opinionated, he can be easily convinced.

If you'd like to get to know Yeoman better and meet some of his friends, [Grunt](http://gruntjs.com) and [Bower](http://bower.io), check out the complete [Getting Started Guide](https://github.com/yeoman/yeoman/wiki/Getting-Started).


## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
