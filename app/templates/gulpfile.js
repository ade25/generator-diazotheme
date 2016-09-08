'use strict'
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import {create as bsCreate} from 'browser-sync';
import del from 'del';
import args from 'yargs';
import {stream as wiredep} from 'wiredep';

const $ = gulpLoadPlugins();
const browserSync = bsCreate();

var cp = require('child_process');
var pkg = require('./package.json');
var fs = require('fs');

// File where the favicon markups are stored
var FAVICON_DATA_FILE = 'faviconData.json';

var messages = {
    jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};

var basePaths = {
    app: 'app',
    dev: '_site',
    dist: 'dist',
    diazoPrefix: '/++theme++pkg.name.sitetheme',
    src: 'node_modules/'
};

var sourcesJS = {
    base: [
        basePaths.src + 'bootstrap-without-jquery/bootstrap3/bootstrap-without-jquery.js',
        basePaths.src + 'lazysizes/lazysizes.js',
        basePaths.src + 'flickity/dist/flickity.pkgd.js'
    ],
    all: [
        basePaths.src + 'jquery/dist/jquery.js',
        basePaths.src + 'modernizr/modernizr.js',
        basePaths.src + 'bootstrap-without-jquery/bootstrap3/bootstrap-without-jquery.js',
        basePaths.src + 'mailcheck/src/mailcheck.js',
        basePaths.src + 'JVFloat/jvfloat.js',
        basePaths.src + 'hideShowPassword/hideShowPassword.js',
        basePaths.src + 'lazysizes/lazysizes.js',
        basePaths.src + 'flickity/dist/flickity.pkgd.js'

    ]
};

var isProduction = args.env === 'dist';

/**
 * Build the Jekyll Site
 */
gulp.task('jekyll-build', function (done) {
    browserSync.notify(messages.jekyllBuild);
    return cp.spawn('jekyll', ['build'], {stdio: 'inherit'})
        .on('close', done);
});

gulp.task('browser-sync', function () {
    browserSync.init({
        notify: false,
        port: 9499,
        server: {
            baseDir: ['.tmp', basePaths.dist],
            routes: {
                '/scripts': basePaths.dist + '/scripts',
                '/styles': basePaths.dist + '/styles',
                '/assets': basePaths.dist + '/assets',
            }
        }
    });
});

gulp.task('bs-reload', function () {
    browserSync.reload();
});

gulp.task('styles', () => {
    return gulp.src(basePaths.app + '/sass/main.scss')
        .pipe($.plumber())
        .pipe($.sourcemaps.init())
        .pipe($.sass.sync({
            outputStyle: 'expanded',
            precision: 10,
            includePaths: [basePaths.src]
        }).on('error', $.sass.logError))
        .pipe($.autoprefixer({browsers: ['last 1 version']}))
        //.pipe($.csscomb())
        .pipe(gulp.dest(basePaths.dist + '/styles/'))
        .pipe($.cssnano())
        .pipe($.rename({
            basename: pkg.name,
            suffix: '.min'
        }))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest(basePaths.dist + '/styles/'))
        .pipe(browserSync.reload({stream: true}))
});

gulp.task('scripts', () => {
    return gulp.src(isProduction ? sourcesJS.all : sourcesJS.base)
        .pipe($.plumber({
            errorHandler: function (error) {
                console.log(error.message);
                this.emit('end');
            }
        }))
        // .pipe($.jshint())
        // .pipe($.jshint.reporter('default'))
        .pipe($.concat(pkg.name + '.js'))
        .pipe(gulp.dest(basePaths.dist + '/scripts/'))
        .pipe($.rename({suffix: '.min'}))
        .pipe($.uglify())
        .pipe(gulp.dest(basePaths.dist + '/scripts/'))
        .pipe(browserSync.reload({stream: true}));
})
;

gulp.task('images', () => {
    return gulp.src(basePaths.app + '/assets/img/**/*')
        .pipe($.if($.if.isFile, $.cache($.imagemin({
                progressive: true,
                interlaced: true,
                // don't remove IDs from SVGs, they are often used
                // as hooks for embedding and styling
                svgoPlugins: [{cleanupIDs: false}]
            }))
            .on('error', function (err) {
                console.log(err);
                this.end();
            })))
        .pipe(gulp.dest(basePaths.dist + '/assets/img'));
})
;

gulp.task('fonts', () => {
    return gulp.src(require('main-bower-files')({
            filter: '**/*.{eot,svg,ttf,woff,woff2}'
        }).concat(basePaths.app + '/assets/fonts/**/*'))
        .pipe(gulp.dest('.tmp/fonts'))
        .pipe(gulp.dest(basePaths.dist + '/assets/fonts'));
})
;

gulp.task('html', () => {
    return gulp.src(basePaths.dev + '{,*/}*.html')
        .pipe($.minifyHtml())
        .pipe(gulp.dest(basePaths.dist));
})
;

gulp.task('cb', () => {
    return gulp.src(basePaths.dist + 'styles/*.min.css')
        .pipe($.rev())
        .pipe(gulp.dest(basePaths.dist + '/styles'))
        .pipe($.rev.manifest())
        .pipe($.revDel({dest: basePaths.dist + '/styles'}))
        .pipe(gulp.dest(basePaths.dist + '/styles'))
}
)
;

gulp.task('revreplace', () => {
    var manifest = gulp.src(basePaths.dist + '/styles/rev-manifest.json');
return gulp.src(basePaths.dev + '/{,*/}*.html')
    .pipe(revReplace({manifest: manifest}))
    .pipe(gulp.dest(basePaths.dev));
})
;

gulp.task('replace', () => {
    return gulp.src(basePaths.dev + '/{,*/}*.html')
        .pipe(replace({
            patterns: [
                {
                    match: '../../assets/',
                    replacement: '../assets/'
                }
            ],
            usePrefix: false,
            preserveOrder: true
        }))
        .pipe(gulp.dest(basePaths.dev))
});

gulp.task('clean', del.bind(null, ['.tmp', basePaths.dist]));

gulp.task('serve', ['styles', 'scripts', 'jekyll-build', 'html'], () => {
  browserSync.init({
    notify: false,
    port: 9499,
    server: {
      baseDir: ['.tmp', basePaths.dist],
      routes: {
        '/scripts': basePaths.dist + '/scripts',
        '/styles': basePaths.dist + '/styles',
        '/assets': basePaths.dist + '/assets',
      }
    }
  });

  gulp.watch([
    basePaths.app + '/*.html',
    basePaths.app + '/scripts/*.js',
    basePaths.app + '/styles/*.css',
  ]).on('change', browserSync.reload);

  gulp.watch(basePaths.app + "sass/**/*.scss", ['styles']);
  gulp.watch(basePaths.app + "scripts/**/*.js", ['scripts']);
  gulp.watch(basePaths.app + "{,*/}*.html", ['jekyll-build', 'html']);
});

gulp.task('default', ['browser-sync'], function () {
    gulp.watch(basePaths.app + "sass/**/*.scss", ['styles']);
    gulp.watch(basePaths.app + "scripts/**/*.js", ['scripts']);
    gulp.watch(basePaths.app + "*.html", ['bs-reload']);
});

// Generate the icons. This task takes a few seconds to complete.
// You should run it at least once to create the icons. Then,
// you should run it whenever RealFaviconGenerator updates its
// package (see the check-for-favicon-update task below).
gulp.task('generate-favicon', function(done) {
    $.realFavicon.generateFavicon({
        masterPicture: basePaths.app + '/assets/ico/favicon.png',
        dest: basePaths.dist + '/assets/ico/',
        iconsPath: '/',
        design: {
            ios: {
                pictureAspect: 'backgroundAndMargin',
                backgroundColor: '#ffffff',
                margin: '14%',
                assets: {
                    ios6AndPriorIcons: false,
                    ios7AndLaterIcons: false,
                    precomposedIcons: false,
                    declareOnlyDefaultIcon: true
                }
            },
            desktopBrowser: {},
            windows: {
                pictureAspect: 'noChange',
                backgroundColor: '#2d89ef',
                onConflict: 'override',
                assets: {
                    windows80Ie10Tile: false,
                    windows10Ie11EdgeTiles: {
                        small: false,
                        medium: true,
                        big: false,
                        rectangle: false
                    }
                }
            },
            androidChrome: {
                pictureAspect: 'backgroundAndMargin',
                margin: '17%',
                backgroundColor: '#ffffff',
                themeColor: '#ffffff',
                manifest: {
                    name: pkg.name,
                    display: 'standalone',
                    orientation: 'notSet',
                    onConflict: 'override',
                    declared: true
                },
                assets: {
                    legacyIcon: false,
                    lowResolutionIcons: false
                }
            },
            safariPinnedTab: {
                pictureAspect: 'silhouette',
                themeColor: '#5bbad5'
            }
        },
        settings: {
            compression: 3,
            scalingAlgorithm: 'Mitchell',
            errorOnImageTooSmall: false
        },
        versioning: {
            paramName: 'v',
            paramValue: 'yyxQeA5p49'
        },
        markupFile: FAVICON_DATA_FILE
    }, function() {
        done();
    });
});

// Inject the favicon markups in your HTML pages. You should run
// this task whenever you modify a page. You can keep this task
// as is or refactor your existing HTML pipeline.
gulp.task('inject-favicon-markups', function() {
    gulp.src([ basePaths.app + '_includes/base/head.html' ])
        .pipe($.realFavicon.injectFaviconMarkups(JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).favicon.html_code))
        .pipe(gulp.dest(basePaths.app + '_includes/base/'));
});

// Check for updates on RealFaviconGenerator (think: Apple has just
// released a new Touch icon along with the latest version of iOS).
// Run this task from time to time. Ideally, make it part of your
// continuous integration system.
gulp.task('check-for-favicon-update', function(done) {
    var currentVersion = JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).version;
    $.realFavicon.checkForUpdates(currentVersion, function(err) {
        if (err) {
            throw err;
        }
    });
});
