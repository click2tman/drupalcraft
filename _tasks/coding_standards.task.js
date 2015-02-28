/**
 * @file
 * The following code provides two tasks, one for ensuring code.
 */
/* globals require */

var gulp = require('gulp'),
    phpcs = require('gulp-phpcs'),
    jshint = require('gulp-jshint'),
    jscs = require('gulp-jscs');

/**
 * @task jscs
 *   Runs JSCS and JSLint on module, theme, and gulp files. Excludes all
 *   minified JavaScript files.
 */
gulp.task('jscs', 'Runs JSCS and JSLint on module, theme and gulp files. Excludes minified js files.', function () {
  return gulp.src([
    'modules/**/*.js',
    '!modules/contrib/**/*.js',
    'themes/**/*.js',
    'gulpfile.js',
    '!modules/**/*.min.js',
    '!themes/**/*.min.js'
  ])
  .pipe(jshint())
  .pipe(jshint.reporter('default'))
  .pipe(jscs());
});

/**
 * @task phpcs
 *   Runs PHPCS on all module and theme PHP. PHP bin set to the
 *   /usr/local/bin/phpcs exe by default, but should be updated to
 *   wherever your phpcs exe is located.
 */
gulp.task('phpcs', 'Run PHPCS on all module and theme PHP files.', function () {
  return gulp.src([
    'modules/**/*.php',
    'modules/**/*.module',
    'modules/**/*.inc',
    'modules/**/*.install',
    '!modules/contrib/**/*.php',
    '!modules/contrib/**/*.module',
    '!modules/contrib/**/*.inc',
    '!modules/contrib/**/*.install',
    'themes/**/*.php',

    // Ignore files automatically generated by features.
    '!modules/**/*.features.inc',
    '!modules/**/*.features.*.inc',
    '!modules/**/*.strongarm.inc',
    '!modules/**/*.views_default.inc',
    '!modules/**/*.field_group.inc',
    '!modules/**/*.context.inc'
  ])
  .pipe(phpcs({
    bin: '/usr/local/bin/phpcs',
    standard: 'PSR2',
    warningSeverity: 0
  }))
  .pipe(phpcs.reporter('log'))
  .pipe(phpcs.reporter('fail'));
});
