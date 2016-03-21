'use strict';

const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();
const webpack = require('webpack-stream');
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

gulp.task('test', function() {
  process.env.NODE_ENV = 'test';
  var result = gulp.src(['**/*.spec.js', '!node_modules/**'], { read: false })
    // gulp-mocha needs filepaths so you can't have any plugins before it
    .pipe(plugins.mocha({ /* reporter: 'nyan' */ }));
  result // Work around hung test. See https://github.com/sindresorhus/gulp-mocha/issues/118
    .once('end', () => {
      process.exit();
    });
  return result;
});

gulp.task('webpack', ['clean', 'lint'], () => { // TODO: we don't really want to clean every time
  return gulp.src('public/client-entry.js')
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(gulp.dest('.tmp/public'));
});

gulp.task('watch', ['version'], () => { // TODO: use http://webpack.github.io/docs/webpack-dev-middleware.html
  return gulp.watch('public/**/*', ['webpack']);
});

gulp.task('serve', ['webpack', 'lint'], () => {
  process.env.NODE_ENV = process.env.NODE_ENV || 'development';
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

gulp.task('default', ['nsp', 'watch', 'serve']);
