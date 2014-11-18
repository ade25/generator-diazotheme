module.exports = function (grunt) {
    'use strict';
    require('time-grunt')(grunt);
    require('jit-grunt')(grunt);
    grunt.initConfig({
        appconfig: {
            dev: require('./bower.json').appPath || '_site',
            dist: 'dist'
        },
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*!\n' + '* <%= pkg.name %> v<%= pkg.version %> by Ade25\n' + '* Copyright <%= pkg.author %>\n' + '* Licensed under <%= pkg.licenses %>.\n' + '*\n' + '* Designed and built by ade25\n' + '*/\n',
        jqueryCheck: 'if (typeof jQuery === "undefined") { throw new Error("We require jQuery") }\n\n',
        clean: { dist: ['<%= appconfig.dist %>'] },
        jshint: {
            options: { jshintrc: 'js/.jshintrc' },
            grunt: { src: 'Gruntfile.js' },
            src: { src: ['js/*.js'] }
        },
        jscs: {
            options: { config: 'js/.jscsrc' },
            grunt: { src: '<%= jshint.grunt.src %>' },
            src: { src: '<%= jshint.src.src %>' }
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
                    'bower_components/hideShowPassword/hideShowPassword.js',
                    'bower_components/lazysizes/lazysizes.js',
                    'js/main.js'
                ],
                dest: '<%= appconfig.dist %>/js/<%= pkg.name %>.js'
            },
            theme: {
                src: [
                    'bower_components/bootstrap/dist/js/bootstrap.js',
                    'bower_components/hideShowPassword/hideShowPassword.js',
                    'bower_components/lazysizes/lazysizes.js',
                    'js/main.js'
                ],
                dest: '<%= appconfig.dist %>/js/main.js'
            }
        },
        uglify: {
            options: { banner: '<%= banner %>' },
            dist: {
                src: ['<%= concat.dist.dest %>'],
                dest: '<%= appconfig.dist %>/js/<%= pkg.name %>.min.js'
            }
        },
        less: {
            compileTheme: {
                options: {
                    strictMath: false,
                    sourceMap: true,
                    outputSourceFiles: true,
                    sourceMapURL: '<%= pkg.name %>.css.map',
                    sourceMapFilename: '<%= appconfig.dist %>/css/<%= pkg.name %>.css.map'
                },
                files: { '<%= appconfig.dist %>/css/<%= pkg.name %>.css': 'less/styles.less' }
            }
        },
        autoprefixer: {
            options: {
                browsers: [
                    'Android 2.3',
                    'Android >= 4',
                    'Chrome >= 20',
                    'Firefox >= 24',
                    'Explorer >= 8',
                    'iOS >= 6',
                    'Opera >= 12',
                    'Safari >= 6'
                ]
            },
            core: {
                options: { map: true },
                src: '<%= appconfig.dist %>/css/<%= pkg.name %>.css'
            }
        },
        csslint: {
            options: { csslintrc: 'less/.csslintrc' },
            src: '<%= appconfig.dist %>/css/<%= pkg.name %>.css'
        },
        cssmin: {
            options: {
                compatibility: 'ie8',
                keepSpecialComments: '*',
                noAdvanced: true
            },
            core: { files: { '<%= appconfig.dist %>/css/<%= pkg.name %>.min.css': 'dist/css/<%= pkg.name %>.css' } }
        },
        csscomb: {
            sort: {
                options: { config: 'less/.csscomb.json' },
                files: { '<%= appconfig.dist %>/css/<%= pkg.name %>.css': ['dist/css/<%= pkg.name %>.css'] }
            }
        },
        criticalcss: {
            frontpage: {
                options: {
                    url: 'http://rms.kreativkombinat.de',
                    width: 1200,
                    height: 900,
                    outputfile: '<%= appconfig.dist %>/css/critical.css',
                    filename: '<%= pkg.name %>.min.css'
                }
            }
        },
        copy: {
            fontawesome: {
                expand: true,
                flatten: true,
                cwd: 'bower_components/',
                src: ['font-awesome/fonts/*'],
                dest: '<%= appconfig.dist %>/assets/fonts/'
            },
            ico: {
                expand: true,
                flatten: true,
                cwd: 'bower_components/',
                src: ['bootstrap/assets/ico/*'],
                dest: '<%= appconfig.dist %>/assets/ico/'
            },
            favicon: {
                expand: true,
                flatten: true,
                src: ['assets/ico/*'],
                dest: '<%= appconfig.dist %>/assets/ico/'
            }
        },
        imagemin: {
            png: {
                options: {
                    optimizationLevel: 7
                },
                files: [{
                    expand: true,
                    cwd: 'assets/img',
                    src: ['**/*.png'],
                    dest: '<%= appconfig.dist %>/assets/img/',
                    ext: '.png'
                }]
            },
            jpg: {
                options: {
                    progressive: true
                },
                files: [{
                    expand: true,
                    cwd: 'assets/img/',
                    src: ['**/*.jpg'],
                    dest: '<%= appconfig.dist %>/assets/img/',
                    ext: '.jpg'
                }]
            }
        },
        svgmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'assets/img/',
                    src: '{,*/}*.svg',
                    dest: '<%= appconfig.dist %>/assets/img/'
                }]
            }
        },
        filerev: {
            options: {
                encoding: 'utf8',
                algorithm: 'md5',
                length: 8
            },
            assets: {
                src: [
                    '<%= appconfig.dist %>/js/{,*/}*.js',
                    '<%= appconfig.dist %>/css/{,*/}*.css'
                ]
            },
            files: {
                src: [
                    '<%= appconfig.dist %>/assets/img/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
                    '<%= appconfig.dist %>/assets/fonts/*'
                ]
            }
        },
        filerev_replace: {
            options: { assets_root: '<%= appconfig.dist %>' },
            views: {
                options: { views_root: '<%= appconfig.dist %>' },
                src: '<%= appconfig.dist %>/*.html'
            }
        },
        qunit: {
            options: { inject: 'js/tests/unit/phantom.js' },
            files: ['js/tests/*.html']
        },
        jekyll: {
            theme: { options: { config: '_config.yml' } },
            server: {
                options: {
                    serve: true,
                    server_port: 8000,
                    auto: true
                }
            }
        },
        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true,
                    conservativeCollapse: true,
                    removeEmptyAttributes: true,
                    removeOptionalTags: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true
                },
                files: [{
                        expand: true,
                        cwd: '<%= appconfig.dev %>',
                        src: [
                            '*.html',
                            '{,*/}*.html'
                        ],
                        dest: '<%= appconfig.dist %>'
                    }]
            }
        },
        sed: {
            cleanAssetsPath: {
                path: '<%= appconfig.dist %>/',
                pattern: '../../assets/',
                replacement: '../assets/',
                recursive: true
            },
            cleanCSSFP: {
                path: '<%= appconfig.dist %>/',
                pattern: '../../<%= appconfig.dist %>/css/<%= pkg.name %>.min.css',
                replacement: '../css/<%= pkg.name %>.min.css',
                recursive: true
            },
            cleanCSS: {
                path: '<%= appconfig.dist %>/',
                pattern: '../<%= appconfig.dist %>/css/<%= pkg.name %>.min.css',
                replacement: 'css/<%= pkg.name %>.min.css',
                recursive: true
            },
            cleanJSFP: {
                path: '<%= appconfig.dist %>/',
                pattern: '../../<%= appconfig.dist %>/js/<%= pkg.name %>.min.js',
                replacement: '../js/<%= pkg.name %>.min.js',
                recursive: true
            },
            cleanJS: {
                path: '<%= appconfig.dist %>/',
                pattern: '../<%= appconfig.dist %>/js/<%= pkg.name %>.min.js',
                replacement: 'js/<%= pkg.name %>.min.js',
                recursive: true
            },
            cleanImgPath: {
                path: '<%= appconfig.dist %>/',
                pattern: '../dist/assets/img/',
                replacement: 'assets/img/',
                recursive: true
            }
        },
        replace: {
            dist: {
                options: {
                    patterns: [
                        {
                            match: '../../assets/',
                            replacement: '../assets/'
                        },
                        {
                            match: '../assets/',
                            replacement: 'assets/'
                        },
                        {
                            match: '../../<%= appconfig.dist %>/css/<%= pkg.name %>.min.css',
                            replacement: '../css/<%= pkg.name %>.min.css'
                        },
                        {
                            match: '../<%= appconfig.dist %>/css/<%= pkg.name %>.min.css',
                            replacement: 'css/<%= pkg.name %>.min.css'
                        },
                        {
                            match: '../../<%= appconfig.dist %>/js/*.js',
                            replacement: '../js/<%= pkg.name %>.min.js'
                        },
                        {
                            match: '../<%= appconfig.dist %>/js/<%= pkg.name %>.min.js',
                            replacement: 'js/<%= pkg.name %>.min.js'
                        }
                    ],
                    usePrefix: false,
                    preserveOrder: true
                },
                files: [{
                        expand: true,
                        cwd: '<%= appconfig.dev %>',
                        src: [
                            '*.html',
                            '{,*/}*.html'
                        ],
                        dest: '<%= appconfig.dev %>'
                    }]
            }
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
            files: { src: ['<%= appconfig.dev %>/**/*.html'] }
        },
        watch: {
            js: {
                files: ['js/{,*/}*.js'],
                tasks: ['newer:jshint:all'],
                options: { livereload: true }
            },
            styles: {
                files: ['<%= appconfig.dev %>/styles/{,*/}*.css'],
                tasks: [
                    'newer:copy:styles',
                    'autoprefixer'
                ]
            },
            less: {
                files: 'less/*.less',
                tasks: ['less'],
                options: { spawn: false }
            },
            gruntfile: { files: ['Gruntfile.js'] },
            livereload: {
                options: { livereload: '<%= connect.options.livereload %>' },
                files: [
                    '<%= appconfig.dev %>/{,*/}*.html',
                    '.tmp/styles/{,*/}*.css',
                    '<%= appconfig.dev %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            }
        },
        connect: {
            options: {
                port: 9000,
                hostname: 'localhost',
                livereload: 35729,
                base: '<%= appconfig.dev %>'
            },
            livereload: {
                options: {
                    open: true,
                    base: [
                        '.tmp',
                        '<%= appconfig.dist %>'
                    ]
                }
            },
            dist: {
                options: {
                    base: '<%= appconfig.dist %>'
                }
            }
        },
        concurrent: {
            cj: [
                'less',
                'copy',
                'concat',
                'uglify'
            ],
            ha: [
                'jekyll:theme',
                'copy-templates',
                'sed'
            ]
        }
    });
    grunt.registerTask('dist-init', '', function () {
        grunt.file.mkdir('<%= appconfig.dist %>/assets/');
    });
    grunt.registerTask('serve', function (target) {
        if (target === 'dist') {
            return grunt.task.run([
                'build',
                'connect:dist:keepalive'
            ]);
        }
        grunt.task.run([
            'autoprefixer',
            'connect:livereload',
            'watch'
        ]);
    });
    grunt.registerTask('validate-html', [
        'jekyll',
        'validation'
    ]);
    grunt.registerTask('unit-test', ['qunit']);
    var testSubtasks = [
            'dist-css',
            'jshint',
            'validate-html'
        ];
    grunt.registerTask('test', testSubtasks);
    grunt.registerTask('dist-js', [
        'concat',
        'uglify'
    ]);
    grunt.registerTask('less-compile', ['less:compileTheme']);
    grunt.registerTask('dist-css', [
        'less-compile',
        'autoprefixer',
        'csscomb',
        'cssmin'
    ]);
    grunt.registerTask('dist-assets', [
        'newer:copy',
        'newer:imagemin'
    ]);
    grunt.registerTask('dist-cb', ['filerev']);
    grunt.registerTask('dist-html', [
        'jekyll:theme',
        'htmlmin',
        'sed'
    ]);
    grunt.registerTask('dist-cc', [
        'test',
        'concurrent:cj',
        'concurrent:ha'
    ]);
    grunt.registerTask('dev', [
        'dist-css',
        'dist-js',
        'dist-html'
    ]);
    grunt.registerTask('dist', [
        'clean',
        'dist-css',
        'dist-js',
        'dist-html',
        'dist-assets'
    ]);
    grunt.registerTask('compile-theme', ['dist']);
    grunt.registerTask('default', ['dev']);
};
