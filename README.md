# generator-diazotheme

[Yeoman](http://yeoman.io) generator that scaffolds out a front-end theme directory.

![](http://i.imgur.com/uKTT2Hj.png)

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

Trick question. It's not a thing. It's this guy:

![](http://i.imgur.com/JHaAlBJ.png)

Basically, he wears a top hat, lives in your computer, and waits for you to tell him what kind of application you wish to create.

Not every new computer comes with a Yeoman pre-installed. He lives in the [npm](https://npmjs.org) package repository. You only have to ask for him once, then he packs up and moves into your hard drive. *Make sure you clean up, he likes new and shiny things.*

```
$ npm install -g yo
```

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
