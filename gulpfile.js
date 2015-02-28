/**
 * @file
 * Gulpfile that contains test, build, and deploy scripts.
 *
 * Update the project_name variable to change the build, package, and message
 * name of the current project. Defaults to 'Drupal'.
 */
/* globals require */

var gulp = require('gulp'),
    requireDir = require('require-dir'),
    glob = require('glob'),
    fs = require('fs'),
    vm = require('vm'),
    gulpHelp = require('gulp-help')(gulp);

// Require _task directory.
requireDir('./_tasks');

// Require installed _deployment options.
glob('_deployments/*/task.js', function(err, files) {
  for (i = 0; i < files.length; i++) {
    vm.runInThisContext(fs.readFileSync(files[i]));
  }
});
