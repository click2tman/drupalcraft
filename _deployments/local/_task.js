/**
 * @file
 * Defines a local deployment task that uses build tools to
 * build a drupal site on your local machine.
 */
/* globals require */

var gulp = require('gulp'),
    shell = require('gulp-shell'),
    del = require('del'),
    options = require('minimist')(process.argv.slice(2));

/**
 * @task build.local
 *   Constructs a working Drupal site on your local machine.
 *
 * @param string options.builddir
 *   Name of subdirectory in which this project should be built.
 * @param string options.dbname
 *   Name of database in which Drupal should be installed.
 * @param string options.dbuser
 *   Mysql user that Drupal should use.
 * @param string options.dbpass
 *   options.dbuser's password.
 */
gulp.task('build.local', 'Constructs a working Drupal site locally within /builds/workdir.', function () {

  if (!options.hasOwnProperty('dbname') || options.dbname.length <= 0) {
    throw new gutil.PluginError('build', 'You must pass in a --dbname setting.');
  }

  if (!options.hasOwnProperty('dbuser') || options.dbuser.length <= 0) {
    throw new gutil.PluginError('build', 'You must pass in a --dbuser setting.');
  }

  if (!options.hasOwnProperty('dbpass') || options.dbpass.length <= 0) {
    throw new gutil.PluginError('build', 'You must pass in a --dbpass setting.');
  }

  del([
    'builds/workdir/**/*',
    '!builds/workdir/README.md'
  ]);

  return gulp.src('drupal.make')
          .pipe(shell('gulp build --builddir workdir --scope dev --dbname ' + options.dbname + ' --dbuser ' + options.dbuser + ' --dbpass ' + options.dbpass));
}, {
  options: {
    'builddir': 'Directory within /builds in which site should be constructed.',
    'dbname': 'Name of database in which Drupal should be installed.',
    'dbuser': 'Mysql user that Drupal should use to log into mysql.',
    'dbpass': 'Password of mysql user that Drupal should use to log into mysql'
  }
});

