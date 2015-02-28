/**
 * @file
 * The following code defines build tasks for constructing a Drupal site.
 */
/* globals require */

var gulp = require('gulp'),
    shell = require('gulp-shell'),
    merge = require('merge-stream'),
    gutil = require('gulp-util'),
    del = require('del'),
    template = require('gulp-template'),
    rename = require('gulp-rename'),
    symlink = require('gulp-symlink'),
    options = require('minimist')(process.argv.slice(2)),
    runSequence = require('run-sequence');

/**
 * @task build
 * Constructs a functional drupal site root.
 *
 * @param string options.builddir
 *   Name of subdirectory in which this project should be built.
 */
gulp.task('build.setup', 'constructs a functional Drupal site root.', function () {
  if (!options.hasOwnProperty('builddir') || options.builddir.length <= 0) {
    throw new gutil.PluginError('build', 'You must pass in a --builddir setting.');
  }

  var builddir = 'builds/' + options.builddir;

  del([builddir]);

  return merge(
      gulp.src('drupal.make')
        .pipe(shell('mkdir -p ' + builddir))
        .pipe(shell('cd ' + builddir + ' && drush make ../../drupal.make -y')),
      gulp.src(['site.settings.php', 'local.settings.php'])
        .pipe(gulp.dest(builddir + '/sites/default')),
      gulp.src('modules')
        .pipe(symlink(builddir + '/sites/all/modules')),
      gulp.src('themes')
        .pipe(symlink(builddir + '/sites/all/themes'))
    );
});

/**
 * @task build.template
 *   Sets up Drupal settings/config files.
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
gulp.task('build.template', 'Constructs Drupal settings/config files.', function () {

  if (!options.hasOwnProperty('dbname') || options.dbname.length <= 0) {
    throw new gutil.PluginError('build', 'You must pass in a --dbname setting.');
  }

  if (!options.hasOwnProperty('dbuser') || options.dbuser.length <= 0) {
    throw new gutil.PluginError('build', 'You must pass in a --dbuser setting.');
  }

  if (!options.hasOwnProperty('dbpass') || options.dbpass.length <= 0) {
    throw new gutil.PluginError('build', 'You must pass in a --dbpass setting.');
  }

  var builddir = 'builds/' + options.builddir;

  return merge(
      gulp.src('_src/db.settings.php')
        .pipe(template({
          'database' : {
            'name' : options.dbname,
            'user' : options.dbuser,
            'password' : options.dbpass
          }
        }))
        .pipe(gulp.dest(builddir + '/sites/default')),
      gulp.src(['local.settings.php'])
        .pipe(gulp.dest(builddir + '/sites/default')),
      gulp.src(['site.settings.php'])
        .pipe(rename('settings.php'))
        .pipe(gulp.dest(builddir + '/sites/default')),
      gulp.src('')
        .pipe(shell('cd ' + builddir + '/sites/default && rm site.settings.php'))
    );
});

/**
 * @task build.install
 *   Runs Drupal installation scripts.
 */
gulp.task('build.install', 'Runs Drupal installation scripts.', function () {
  if (!options.hasOwnProperty('builddir') || options.builddir.length <= 0) {
    throw new gutil.PluginError('build', 'You must pass in a --builddir setting.');
  }

  if (!options.hasOwnProperty('scope') || options.scope.length <= 0) {
    throw new gutil.PluginError('build', 'You must pass in a --scope setting.');
  }

  var builddir = 'builds/' + options.builddir;

  return gulp.src('')
          .pipe(shell('cd ' + builddir + '&& drush si -y --account-pass=admin && drush -y en master'))
          .pipe(shell('cd ' + builddir + '&& drush master-set-current-scope ' + options.scope + ' && drush -y master-execute'));
});

/**
 * @task build
 *   Runs build.setup, build.template, and build.install
 *   to create a local Drupal root.
 */
gulp.task('build', 'Constructs a working Drupal site within a specified directory.', function() {
  runSequence('build.setup', 'build.template', 'build.install');
});

/**
 * @task setup
 *   Constructs a working Drupal site.
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
});

