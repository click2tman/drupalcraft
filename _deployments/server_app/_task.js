/**
 * @file
 * The following code defines a docker deployment task.
 */
/* globals require */

var gulp = require('gulp'),
    shell = require('gulp-shell'),
    request = require('request'),
    gutil = require('gulp-util'),
    cp = require('child_process');

gulp.task('deployments.docker', 'Deploy your current master to Docker.', function () {
  var buildInfo = {
    'iid': '6c3a57612039fb582bdc68e5811ee685c049e200a51cf25511687dd909938436',
    'git': ''
  };

  cp.exec('git config --get remote.origin.url', function (error, stdout, stderr) {
    if (error || stdout === '') {
      throw new gutil.PluginError('docker', 'Trouble getting remote.origin.url');
    }

    buildInfo.git = stdout.replace(/(\r\n|\n|\r)/gm, '');

    request.post({
      'url': 'http://local.docker:5000',
      'headers': {'Content-Type' : 'application/json'},
      'body': JSON.stringify(buildInfo)
    }, function (error, response, body) {
      if (error) {
        throw new gutil.PluginError('docker', error);
      }

      return console.log(response.body);
    });
  });
});
