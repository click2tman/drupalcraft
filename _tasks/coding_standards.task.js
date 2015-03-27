/**
 * @file
 * The following code provides two tasks, one for ensuring code.
 */
/* globals require */

var gulp = require('gulp'),
    tap = require('gulp-tap'),
    phpcs = require('gulp-phpcs'),
    jshint = require('gulp-jshint'),
    execSync = require('sync-exec'),
    options = require('minimist')(process.argv.slice(2)),
    jscs = require('gulp-jscs');

/**
 * @task jscs
 *   Runs JSCS and JSLint on module, theme, and gulp files. Excludes all
 *   minified JavaScript files.
 */
gulp.task('jscs', 'Runs JSCS and JSLint on module, theme and gulp files. Excludes minified js files.', function () {
  var sourcePatterns = [
    'modules/**/*.js',
    'themes/**/*.js',
    'gulpfile.js',
    '_tasks/*.js',
    '_deployments/**/*.js',
    '!modules/contrib/**/*.js',
    '!modules/**/*.min.js',
    '!themes/**/*.min.js',
    '!themes/contrib/**/*.js'
  ];

  // If path is provided, override.
  if (options.hasOwnProperty('path') && options.path.length > 0) {
    sourcePatterns = [
      options.path + '/*.js',
      options.path + '/**/*.js'
    ];
  }

  return gulp.src(sourcePatterns)
  .pipe(jshint())
  .pipe(jshint.reporter('default'))
  .pipe(jscs());
}, {
  options: {
    'path': '(optional) Path to folder that should be scanned.'
  }
});

/**
 * @task phpcs
 *   Check the quality of your PHP files.
 */
gulp.task('phpcs', 'Checks the quality of your PHP files.', function () {
  // Source file defaults to a pattern.
  var extensions = '{php,module,inc,install,test,profile,theme}',
      sourcePatterns = [
        'themes/**/*.' + extensions,
        'modules/custom/**/*.' + extensions,
        '!modules/contrib/**/*.' + extensions,
        '!modules/**/*.features.inc',
        '!modules/**/*.features.*.inc',
        '!modules/**/*.strongarm.inc',
        '!modules/**/*.views_default.inc',
        '!modules/**/*.field_group.inc',
        '!modules/**/*.context.inc'
      ];

  // If path is provided, override.
  if (options.hasOwnProperty('path') && options.path.length > 0) {
    sourcePatterns = [
      options.path + '/*.' + extensions,
      options.path + '/**/*.' + extensions
    ];
  }

  return gulp.src(sourcePatterns)
  .pipe(tap(function (file, t) {
    var report = execSync('bin/phpcs --standard="modules/contrib/coder/coder_sniffer/Drupal" ' + file.path);
    if (report.stdout.length > 0) {
      // Log report, and remove silly Code Sniffer 2.0 ad.
      console.log(report.stdout.split('UPGRADE TO PHP_CODESNIFFER 2.0 TO FIX ERRORS AUTOMATICALLY')[0]);
    }
  }));
}, {
  options: {
    'path': '(optional) Path to folder that should be scanned.'
  }
});
