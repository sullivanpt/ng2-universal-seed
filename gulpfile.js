'use strict';

const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();
var webpack = require('webpack-stream');
var del = require('del');

gulp.task('clean', () => {
  return del(['.tmp']);
});

gulp.task('webpack', ['clean'], () => {
  return gulp.src('client/index.js')
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(gulp.dest('.tmp/client'));
});

gulp.task('watch', () => { // TODO: use http://webpack.github.io/docs/webpack-dev-middleware.html
  return gulp.watch('client/**/*', ['webpack']);
});

gulp.task('serve', [ 'webpack' ], () => {
  process.env.NODE_ENV = process.env.NODE_ENV || 'development';
  plugins.nodemon({
    verbose: true,
    watch: [ 'client', 'server' ],
    script: 'index.js',
    // tasks: [ 'webpack' ] // broken see https://github.com/JacksonGariety/gulp-nodemon/issues/81
  })
    .on('restart', function(files) {
      console.log('App restarted due to: ', files);
    });
});

gulp.task('default', ['watch', 'serve']);
