/*

REQUIRED STUFF
==============
*/

var changed     = require('gulp-changed');
var gulp        = require('gulp');
var sass        = require('gulp-sass');
var sourcemaps  = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();
var notify      = require('gulp-notify');
var prefix      = require('gulp-autoprefixer');
var cleancss   = require('gulp-clean-css');
var uglify      = require('gulp-uglify');
var cache       = require('gulp-cache');
var concat      = require('gulp-concat');
var util        = require('gulp-util');
var header      = require('gulp-header');
var pixrem      = require('gulp-pixrem');
var exec        = require('child_process').exec;

/*

FILE PATHS
==========
*/

var themeDir = 'content/themes/dude';
var sassSrc = themeDir + '/sass/**/*.{sass,scss}';
var sassFile = themeDir + '/sass/base/global.scss';
var cssDest = themeDir + '/css';
var customjs = themeDir + '/js/scripts.js';
var jsSrc = themeDir + '/js/src/**/*.js';
var jsDest = themeDir + '/js';

/*

ERROR HANDLING
==============
*/

var handleError = function(task) {
  return function(err) {

      notify.onError({
        message: task + ' failed, check the logs..'
      })(err);

    util.log(util.colors.bgRed(task + ' error:'), util.colors.red(err));
  };
};

/*

BROWSERSYNC
===========

Notes:
   - Add only file types you are working on - if watching the whole themeDir,
     task trigger will be out of sync because of the sourcemap-files etc.
   - Adding only part of the files will also make the task faster

*/

gulp.task('browsersync', function() {

  var files = [
    themeDir + '/**/*.php',
    jsSrc
  ];

  browserSync.init(files, {
    proxy: "http://dude.test",
    notify: true,
    browser: "Chromium",
    open: false
  });

});

/*

STYLES
======
*/

gulp.task('styles', function() {

  gulp.src(sassFile)

    .pipe(sass({
      compass: false,
      bundleExec: true,
      sourcemap: false,
      style: 'compressed',
      debugInfo: true,
      lineNumbers: true,
      errLogToConsole: true,
      includePaths: [
        themeDir + '/node_modules/',
        'node_modules/'
      ],
    }))

    .on('error', handleError('styles'))
    .pipe(prefix('last 3 version', 'safari 5', 'ie 9', 'opera 12.1', 'ios 6', 'android 4')) // Adds browser prefixes (eg. -webkit, -moz, etc.)
    .pipe(pixrem())
    .pipe(cleancss({
      compatibility: 'ie11',
      level: {
        1: {
          tidyAtRules: true,
          cleanupCharsets: true,
          specialComments: 0
        }
      }
    }, function(details) {
        console.log('[clean-css] Original size: ' + details.stats.originalSize + ' bytes');
        console.log('[clean-css] Minified size: ' + details.stats.minifiedSize + ' bytes');
        console.log('[clean-css] Time spent on minification: ' + details.stats.timeSpent + ' ms');
        console.log('[clean-css] Compression efficiency: ' + details.stats.efficiency * 100 + ' %');
    }))
    .pipe(gulp.dest(cssDest))
    .pipe(browserSync.stream());

});

/*

SCRIPTS
=======
*/

var currentDate   = util.date(new Date(), 'dd-mm-yyyy HH:ss');
var pkg       = require('./package.json');
var banner      = '/*! <%= pkg.name %> <%= currentDate %> - <%= pkg.author %> */\n';

gulp.task('js', function() {

      gulp.src(
        [
          'node_modules/moment/moment.js',
          themeDir + '/js/src/moment-locale-fi.js',
          themeDir + '/node_modules/autosize/dist/autosize.js',
          themeDir + '/node_modules/js-cookie/src/js.cookie.js',
          themeDir + '/node_modules/timeme.js/timeme.js',
          themeDir + '/node_modules/what-input/dist/what-input.js',
          themeDir + '/js/src/skip-link-focus-fix.js',
					themeDir + '/js/src/frontpage-staff.js',
          themeDir + '/js/src/prism.js',
          themeDir + '/js/src/navigation.js',
          themeDir + '/js/src/scripts.js'
        ])
        .pipe(concat('all.js'))
        .pipe(uglify({
          compress: true,
          mangle: true}).on('error', function(err) {
            util.log(util.colors.red('[Error]'), err.toString());
            this.emit('end');
          }))
        .pipe(gulp.dest(jsDest));
});

gulp.task('blog-wheel-js', function() {

      gulp.src(
        [
          themeDir + '/node_modules/vue/dist/vue.min.js',
          themeDir + '/js/src/slick-a11yfix.js',
          themeDir + '/js/src/blog-scroller.js'
        ])
        .pipe(concat('blog-scroller.js'))
        .pipe(uglify({
          compress: true,
          mangle: true}).on('error', function(err) {
            util.log(util.colors.red('[Error]'), err.toString());
            this.emit('end');
          }))
        .pipe(header(banner, {pkg: pkg, currentDate: currentDate}))
        .pipe(gulp.dest(jsDest));
});

gulp.task('contributions-js', function() {

      gulp.src(
        [
          themeDir + '/node_modules/particles.js/particles.js',
          themeDir + '/js/src/contributions.js'
        ])
        .pipe(concat('contributions.js'))
        .pipe(uglify({
          compress: true,
          mangle: true}).on('error', function(err) {
            util.log(util.colors.red('[Error]'), err.toString());
            this.emit('end');
          }))
        .pipe(header(banner, {pkg: pkg, currentDate: currentDate}))
        .pipe(gulp.dest(jsDest));
});

gulp.task('interactive-form-js', function() {

      gulp.src(
        [
          themeDir + '/js/src/interactive-form.js'
        ])
        .pipe(concat('interactive-form.js'))
        .pipe(uglify({
          compress: true,
          mangle: true}).on('error', function(err) {
            util.log(util.colors.red('[Error]'), err.toString());
            this.emit('end');
          }))
        .pipe(header(banner, {pkg: pkg, currentDate: currentDate}))
        .pipe(gulp.dest(jsDest));
});

gulp.task('person-js', function() {

      gulp.src(
        [
          themeDir + '/js/src/person.js'
        ])
        .pipe(concat('person.js'))
        .pipe(uglify({
          compress: true,
          mangle: true}).on('error', function(err) {
            util.log(util.colors.red('[Error]'), err.toString());
            this.emit('end');
          }))
        .pipe(header(banner, {pkg: pkg, currentDate: currentDate}))
        .pipe(gulp.dest(jsDest));
});

gulp.task('blog-single-js', function() {

      gulp.src(
        [
          themeDir + '/js/src/like.js'
        ])
        .pipe(concat('like.js'))
        .pipe(uglify({
          compress: true,
          mangle: true}).on('error', function(err) {
            util.log(util.colors.red('[Error]'), err.toString());
            this.emit('end');
          }))
        .pipe(header(banner, {pkg: pkg, currentDate: currentDate}))
        .pipe(gulp.dest(jsDest));
});

gulp.task('archive-js', function() {

      gulp.src(
        [
          themeDir + '/node_modules/vue/dist/vue.min.js',
          themeDir + '/js/src/archive.js'
        ])
        .pipe(concat('archive.js'))
        .pipe(uglify({
          compress: true,
          mangle: true}).on('error', function(err) {
            util.log(util.colors.red('[Error]'), err.toString());
            this.emit('end');
          }))
        .pipe(header(banner, {pkg: pkg, currentDate: currentDate}))
        .pipe(gulp.dest(jsDest));
});

/*

WATCH
=====

*/

// Run the JS task followed by a reload
gulp.task('js-watch', ['js', 'blog-wheel-js', 'contributions-js', 'interactive-form-js', 'person-js', 'blog-single-js', 'archive-js'], browserSync.reload);
gulp.task('watch', ['browsersync'], function() {

  gulp.watch(sassSrc, ['styles']);
  gulp.watch(jsSrc, ['js-watch']);

});
