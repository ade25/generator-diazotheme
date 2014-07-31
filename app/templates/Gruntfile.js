/* jshint node: true */

module.exports = function (grunt) {

  'use strict';

  // load all grunt tasks
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({

    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*!\n' +
              '* <%= pkg.name %> v<%= pkg.version %> by Ade25\n' +
              '* Copyright <%= pkg.author %>\n' +
              '* Licensed under <%= pkg.licenses %>.\n' +
              '*\n' +
              '* Designed and built by ade25\n' +
              '*/\n',
    jqueryCheck: 'if (typeof jQuery === "undefined") { throw new Error(\"We require jQuery\") }\n\n',

      // Task configuration.
    clean: {
      dist: ['dist']
    },

    jshint: {
      options: {
        jshintrc: 'js/.jshintrc'
      },
      grunt: {
        src: 'Gruntfile.js'
      },
      src: {
        src: ['js/*.js']
      }
    },

    jscs: {
      options: {
        config: 'js/.jscsrc'
      },
      grunt: {
        src: '<%= jshint.grunt.src %>'
      },
      src: {
        src: '<%= jshint.src.src %>'
      }
    },

    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: false
      },
      dist: {
        src: [
          'bower_components/jquery/dist/jquery.js',
          'bower_components/modernizr/modernizr.js',
          'bower_components/bootstrap/dist/js/bootstrap.js',
          'bower_components/holderjs/holder.js',
          'js/main.js'
        ],
        dest: 'dist/js/<%= pkg.name %>.js'
      },
      theme: {
        src: [
          'bower_components/bootstrap/dist/js/bootstrap.js',
          'js/main.js'
        ],
        dest: 'dist/js/main.js'
      }
    },

    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: ['<%= concat.dist.dest %>'],
        dest: 'dist/js/<%= pkg.name %>.min.js'
      }
    },

    less: {
      compileTheme: {
        options: {
          strictMath: false,
          sourceMap: true,
          outputSourceFiles: true,
          sourceMapURL: '<%= pkg.name %>.css.map',
          sourceMapFilename: 'dist/css/<%= pkg.name %>.css.map'
        },
        files: {
          'dist/css/<%= pkg.name %>.css': 'less/styles.less'
        }
      }
    },

    autoprefixer: {
      options: {
        browsers: [
          'Android 2.3',
          'Android >= 4',
          'Chrome >= 20',
          'Firefox >= 24', // Firefox 24 is the latest ESR
          'Explorer >= 8',
          'iOS >= 6',
          'Opera >= 12',
          'Safari >= 6'
        ]
      },
      core: {
        options: {
          map: true
        },
        src: 'dist/css/<%= pkg.name %>.css'
      }
    },

    csslint: {
      options: {
        csslintrc: 'less/.csslintrc'
      },
      src: 'dist/css/<%= pkg.name %>.css'
    },

    cssmin: {
      options: {
        compatibility: 'ie8',
        keepSpecialComments: '*',
        noAdvanced: true
      },
      core: {
        files: {
          'dist/css/<%= pkg.name %>.min.css': 'dist/css/<%= pkg.name %>.css'
        }
      }
    },

    csscomb: {
      sort: {
        options: {
          config: 'less/.csscomb.json'
        },
        files: {
          'dist/css/<%= pkg.name %>.css': ['dist/css/<%= pkg.name %>.css']
        }
      }
    },

    copy: {
      fontawesome: {
        expand: true,
        flatten: true,
        cwd: 'bower_components/',
        src: ['font-awesome/fonts/*'],
        dest: 'dist/assets/fonts/'
      },
      fonts: {
        expand: true,
        flatten: true,
        src: ['assets/font/*'],
        dest: 'dist/assets/fonts/'
      },
      css: {
        expand: true,
        flatten: true,
        src: ['assets/css/*'],
        dest: 'dist/assets/css/'
      },
      ico: {
        expand: true,
        flatten: true,
        cwd: 'bower_components/',
        src: ['bootstrap/assets/ico/*'],
        dest: 'dist/assets/ico/'
      },
      images: {
        expand: true,
        flatten: true,
        src: ['assets/img/*'],
        dest: 'dist/assets/img/'
      }
    },

    imagemin: {
      dynamic: {
        files: [{
          expand: true,
          cwd: 'assets/img/',
          src: ['**/*.{png,jpg,gif}'],
          dest: 'dist/assets/img/'
        }]
      }
    },

    rev: {
      options:  {
        algorithm: 'sha256',
        length: 8
      },
      files: {
        src: ['dist/**/*.{js,css,png,jpg}']
      }
    },
    qunit: {
      options: {
        inject: 'js/tests/unit/phantom.js'
      },
      files: ['js/tests/*.html']
    },

    connect: {
      server: {
        options: {
          port: 3000,
          base: '.'
        }
      }
    },
    jekyll: {
      theme: {}
    },

    sed: {
      cleanAssetsPath: {
        path: 'dist/',
        pattern: '../../assets/',
        replacement: '../assets/',
        recursive: true
      },
      cleanCSS: {
        path: 'dist/',
        pattern: '../dist/css/<%= pkg.name %>.min.css',
        replacement: 'dist/css/<%= pkg.name %>.min.css',
        recursive: true
      },
      cleanJS: {
        path: 'dist/',
        pattern: '../dist/css/<%= pkg.name %>.min.js',
        replacement: 'dist/css/<%= pkg.name %>.min.js',
        recursive: true
      },
      cleanImgPath: {
        path: 'dist/theme.html',
        pattern: '../assets/img/',
        replacement: 'assets/img/',
      },
    },

    validation: {
      options: {
        charset: 'utf-8',
        doctype: 'HTML5',
        failHard: true,
        reset: true,
        relaxerror: [
          'Bad value X-UA-Compatible for attribute http-equiv on element meta.',
          'Element img is missing required attribute src.'
        ]
      },
      files: {
        src: ['_site/**/*.html']
      }
    },

    watch: {
      src: {
        files: '<%= jshint.src.src %>',
        tasks: ['jshint:src', 'qunit']
      },
      test: {
        files: '<%= jshint.test.src %>',
        tasks: ['jshint:test', 'qunit']
      },
      less: {
        files: 'less/*.less',
        tasks: ['less'],
        options: {
          spawn: false
        }
      }
    },

    concurrent: {
      cj: ['less', 'copy', 'concat', 'uglify'],
      ha: ['jekyll:theme', 'copy-templates', 'sed']
    }

  });


  // -------------------------------------------------
  // These are the available tasks provided
  // Run them in the Terminal like e.g. grunt dist-css
  // -------------------------------------------------

  // Prepare distrubution
  grunt.registerTask('dist-init', '', function () {
    grunt.file.mkdir('dist/assets/');
  });

  // Copy jekyll generated templates and rename for diazo
  grunt.registerTask('copy-templates', '', function () {
    grunt.file.copy('_site/index.html', 'dist/theme.html');
    grunt.file.copy('_site/signin/index.html', 'dist/signin.html');
  });

  // Docs HTML validation task
  grunt.registerTask('validate-html', ['jekyll', 'validation']);

  // Javascript Unittests
  grunt.registerTask('unit-test', ['qunit']);

  // Test task.
  var testSubtasks = ['dist-css', 'jshint', 'validate-html'];

  grunt.registerTask('test', testSubtasks);

  // JS distribution task.
  grunt.registerTask('dist-js', ['concat', 'uglify']);

  // CSS distribution task.
  grunt.registerTask('less-compile', ['less:compileTheme']);
  grunt.registerTask('dist-css', ['less-compile', 'autoprefixer', 'csscomb', 'cssmin']);

  // Assets distribution task.
  grunt.registerTask('dist-assets', ['newer:copy', 'newer:imagemin']);

  // Cache buster distribution task.
  grunt.registerTask('dist-cb', ['rev']);

  // Template distribution task.
  grunt.registerTask('dist-html', ['jekyll:theme', 'copy-templates', 'sed']);

  // Concurrent distribution task
  grunt.registerTask('dist-cc', ['test', 'concurrent:cj', 'concurrent:ha']);

  // Development task.
  grunt.registerTask('dev', ['less-compile', 'dist-js', 'dist-html']);

  // Full distribution task.
  grunt.registerTask('dist', ['clean', 'dist-css', 'dist-js', 'dist-html', 'dist-assets']);

  // Shim theme compilation alias
  grunt.registerTask('compile-theme', ['dist']);

  // Default task.
  grunt.registerTask('default', ['dev']);

};