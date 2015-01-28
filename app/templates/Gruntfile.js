module.exports = function (grunt) {
    'use strict';
    require('time-grunt')(grunt);
    require('jit-grunt')(grunt);
    grunt.initConfig({
        appconfig: {
            dev: require('./bower.json').appPath || '_site',
            dist: 'dist',
            diazoPrefix: '/++theme++<%= pkg.name %>.sitetheme'
        },
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*!\n' + '* <%= pkg.name %> v<%= pkg.version %> by Ade25\n' + '* Copyright <%= pkg.author %>\n' + '* Licensed under <%= pkg.licenses %>.\n' + '*\n' + '* Designed and built by ade25\n' + '*/\n',
        jqueryCheck: 'if (typeof jQuery === "undefined") { throw new Error("We require jQuery") }\n\n',
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
                    'bower_components/blazy/blazy.js',
                    'js/main.js'
                ],
                dest: '<%= appconfig.dist %>/js/<%= pkg.name %>.js'
            },
            theme: {
                src: [
                    'bower_components/bootstrap/dist/js/bootstrap.js',
                    'bower_components/blazy/blazy.js',
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
                    url: 'http://<%= pkg.name %>.kreativkombinat.de',
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
                length: 12
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
        usemin: {
            html: ['<%= config.dist %>/{,*/}*.html'],
            htmlcustom: ['<%= config.dist %>/*.html'],
            css: ['<%= config.dist %>/css/*.css'],
            options: {
                assetsDirs: [
                    '<%= config.dist %>',
                    '<%= config.dist %>/css',
                    '<%= config.dist %>/assets'
                ],
                patterns: {
                    htmlcustom: [
                        [
                            /(?:src=|url\(\s*)['"]?([^'"\)(\?|#)]+)['"]?\s*\)?/gm,
                            'Replacing src references in inline javascript'
                        ],
                        [
                            /(?:data-src=|url\(\s*)['"]?([^'"\)(\?|#)]+)['"]?\s*\)?/gm,
                            'Update the img data-src attributes with the new img filenames'
                        ]
                    ]
                }
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
        replace: {
            server: {
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
                            match: '../../<%= config.dist %>/css/<%= pkg.name %>.min.css',
                            replacement: '../css/<%= pkg.name %>.min.css'
                        },
                        {
                            match: '../<%= config.dist %>/css/<%= pkg.name %>.min.css',
                            replacement: 'css/<%= pkg.name %>.min.css'
                        },
                        {
                            match: '../../<%= config.dist %>/js/<%= pkg.name %>.min.js',
                            replacement: '../js/<%= pkg.name %>.min.js'
                        },
                        {
                            match: '../<%= config.dist %>/js/<%= pkg.name %>.min.js',
                            replacement: 'js/<%= pkg.name %>.min.js'
                        }
                    ],
                    usePrefix: false,
                    preserveOrder: true
                },
                files: [{
                        expand: true,
                        cwd: '<%= config.dev %>',
                        src: [
                            '*.html',
                            '{,*/}*.html'
                        ],
                        dest: '<%= config.dev %>'
                    }]
            },
            dist: {
                options: {
                    patterns: [
                        {
                            match: '../../assets/',
                            replacement: 'assets/'
                        },
                        {
                            match: '../assets/',
                            replacement: 'assets/'
                        },
                        {
                            match: 'assets/',
                            replacement: '<%= config.diazoPrefix %>/<%= config.dist %>/assets/'
                        },
                        {
                            match: '../css/',
                            replacement: 'css/'
                        },
                        {
                            match: 'css/',
                            replacement: '<%= config.diazoPrefix %>/<%= config.dist %>/css/'
                        },
                        {
                            match: '../js/<%= pkg.name %>',
                            replacement: 'js/<%= pkg.name %>'
                        },
                        {
                            match: 'js/<%= pkg.name %>',
                            replacement: '<%= config.diazoPrefix %>/<%= config.dist %>/js/<%= pkg.name %>'
                        }
                    ],
                    usePrefix: false,
                    preserveOrder: true
                },
                files: [{
                        expand: true,
                        cwd: '<%= config.dist %>',
                        src: [
                            '*.html',
                            '{,*/}*.html'
                        ],
                        dest: '<%= config.dist %>'
                    }]
            }
        },
        clean: {
            dist: {
                files: [{
                        dot: true,
                        src: ['<%= config.dist %>']
                    }]
            },
            revved: {
                files: [{
                        dot: true,
                        src: [
                            '<%= config.dist %>/js/*.min.*.js',
                            '<%= config.dist %>/css/*.min.*.css'
                        ]
                    }]
            },
            assets: {
                files: [{
                        dot: true,
                        src: ['<%= config.dist %>/assets/*']
                    }]
            },
            server: {
                files: [{
                        dot: true,
                        src: [
                            '<%= config.dist %>/*',
                            '!<%= config.dist %>/assets'
                        ]
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
            html: {
                files: ['*.html'],
                tasks: ['jekyll:theme', 'replace', 'htmlmin']
            },
            less: {
                files: 'less/*.less',
                tasks: [
                    'less',
                    'autoprefixer',
                    'csscomb',
                    'cssmin'
                ],
                options: { spawn: false }
            },
            gruntfile: { files: ['Gruntfile.js'] },
            livereload: {
                options: { livereload: '<%= connect.options.livereload %>' },
                files: [
                    '<%= appconfig.dev %>/{,*/}*.html',
                    '<%= appconfig.dev %>/{,*/}*.css',
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
            'js',
            'css',
            'connect:livereload',
            'watch'
        ]);
    });
    grunt.registerTask('validate-html', [
        'jekyll',
        'validation'
    ]);
    grunt.registerTask('test', [
        'css',
        'jshint',
        'validate-html'
    ]);
    grunt.registerTask('js', [
        'concat',
        'uglify'
    ]);
    grunt.registerTask('less-compile', [
        'less:compileTheme'
    ]);
    grunt.registerTask('css', [
        'less-compile',
        'autoprefixer',
        'csscomb',
        'cssmin'
    ]);
    grunt.registerTask('dist-assets', [
        'newer:copy',
        'newer:imagemin'
    ]);
    grunt.registerTask('cb', [
        'clean:revved',
        'filerev:assets',
        'usemin'
    ]);
    grunt.registerTask('templates', ['jekyll:theme']);
    grunt.registerTask('html', [
        'templates',
        'replace',
        'htmlmin'
    ]);
    grunt.registerTask('dist-cc', [
        'test',
        'concurrent:cj'
    ]);
    grunt.registerTask('dev', [
        'html',
        'css'
    ]);
    grunt.registerTask('dist', [
        'clean:server',
        'css',
        'js',
        'html',
        'cb'
    ]);
    grunt.registerTask('build', [
        'clean:server',
        'css',
        'js',
        'html',
        'filerev:assets',
        'usemin'
    ]);
    grunt.registerTask('compile-theme', ['dist']);
    grunt.registerTask('default', ['dev']);
};
