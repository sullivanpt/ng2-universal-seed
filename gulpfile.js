'use strict';

const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();
// const webpack = require('webpack-stream'); // TODO: seems not to work with mutiple output bundles
const webpack = require('webpack');
const del = require('del');
const gitDescribe = require('git-describe');
const fs = require('fs');
const path = require('path');

gulp.task('version', () => {
  // If you need a more 'pipe' like implementation see http://stackoverflow.com/a/24451738
  var rev = gitDescribe.gitDescribeSync();
  fs.writeFileSync('public/version.json', JSON.stringify({
    revision: rev.raw, // TODO: consider rev.semverString here '2.1.0-beta+6.g3c9c15b'
    date: (new Date()).toISOString()
  }));
});

gulp.task('clean', ['version'], () => {
  return del(['.tmp']);
});

gulp.task('nsp', function(cb) {
  plugins.nsp({ package: path.resolve(__dirname, './package.json') }, cb);
});

gulp.task('lint', function() { // webpack eslint-loader wouldn't get full coverage
  // ESLint ignores files with "node_modules" paths.
  // So, it's best to have gulp ignore the directory as well.
  // Also, Be sure to return the stream from the task;
  // Otherwise, the task may end before the stream has finished.
  return gulp.src(['**/*.js', '!node_modules/**'])
    // eslint() attaches the lint output to the "eslint" property
    // of the file object so it can be used by other modules.
    .pipe(plugins.eslint())
    // eslint.format() outputs the lint results to the console.
    // Alternatively use eslint.formatEach() (see Docs).
    .pipe(plugins.eslint.format())
    // To have the process exit with an error code (1) on
    // lint error, return the stream and pipe to failAfterError last.
    .pipe(plugins.eslint.failAfterError());
});

// TODO: consider karma for client side JS testing. Not sure we need it as server tests provide universal coverage
// See https://github.com/karma-runner/gulp-karma
// And https://github.com/AngularClass/angular2-webpack-starter/blob/master/config/spec-bundle.js

gulp.task('test', ['webpack'], function() { // TODO: only webpack server assets for server test, or load app directly
  process.env.NODE_ENV = 'test';
  return gulp.src(['**/*.spec.js', '!node_modules/**'])
    // gulp-jasmine needs filepaths so you can't have any plugins before it
    .pipe(plugins.jasmine({ verbose: true, captureExceptions: true }))
    .pipe(plugins.exit()); // See https://github.com/sindresorhus/gulp-jasmine/issues/49
});

// TODO: 'gulp-protractor' on spec/e2e folder
// See https://github.com/angular-fullstack/generator-angular-fullstack/blob/master/app/templates/gulpfile.babel(gulp).js

gulp.task('webpack', ['clean', 'lint'], (callback) => { // TODO: we don't really want to clean every time
  // run webpack
  webpack(require('./webpack.config.js'), function (err, stats) {
    if (err) return callback(err);
    console.log('[webpack]', stats.toString({
      // output options
      chunks: false
    }));
    callback();
  });
  /*
// TODO: seems not to work with mutiple output bundles
  return gulp.src('public/client-entry.js')
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(gulp.dest('.tmp/public'));
  */
});

gulp.task('watch', ['version'], () => { // TODO: use http://webpack.github.io/docs/webpack-dev-middleware.html
  return gulp.watch('public/**/*', ['webpack']);
});

gulp.task('serve', ['webpack', 'lint'], () => {
  process.env.NODE_ENV = process.env.NODE_ENV || 'development'; // TODO: 'gulp-env' see https://github.com/angular-fullstack/generator-angular-fullstack/blob/master/app/templates/gulpfile.babel(gulp).js
  plugins.nodemon({
    verbose: true,
    watch: ['public', 'server'],
    script: 'index.js',
    // tasks: [ 'webpack' ] // broken see https://github.com/JacksonGariety/gulp-nodemon/issues/81
  })
    .on('restart', function(files) {
      console.log('App restarted due to: ', files);
    });
});

gulp.task('default', ['nsp', 'watch', 'serve']); // TODO: gulp4.series or 'run-sequence' so clean only happens once
