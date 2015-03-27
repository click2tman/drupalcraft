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
    pjson = require('./package.json'),
    _ = require('lodash'),
    gulpHelp = require('gulp-help')(gulp);

// Require _task directory.
requireDir('./_tasks');

// Require enabled deployment options.
_.forOwn(pjson.deployments, function(path) {
  require('./' + path);
});
