'use strict';

const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();
const nodemon = require('nodemon');
var webpack = require('webpack-stream');
var del = require('del');

gulp.task('clean', () => {
  return del(['dist']);
});

gulp.task('webpack', ['clean'], function() {
  return gulp.src('src/entry.js')
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(gulp.dest('dist/client'));
});

gulp.task('start:server', [ 'webpack' ], () => {
  process.env.NODE_ENV = process.env.NODE_ENV || 'development';
  nodemon({
    verbose: true,
    watch: 'src',
    script: 'index.js' // include babel
  })
    .on('log', function onServerLog(log) {
      console.log(plugins.util.colors.white('[') +
        plugins.util.colors.yellow('nodemon') +
        plugins.util.colors.white('] ') +
        log.message);
    })
    .on('restart', function(files) {
      console.log('App restarted due to: ', files);
    });
});


gulp.task('serve', ['start:server']);

gulp.task('default', ['serve']);
