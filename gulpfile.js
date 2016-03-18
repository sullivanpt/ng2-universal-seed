'use strict';

const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();
var del = require('del');

gulp.task('clean', () => {
  return del(['.tmp']);
});

gulp.task('serve', [ 'clean' ], () => {
  process.env.NODE_ENV = process.env.NODE_ENV || 'development';
  plugins.nodemon({
    verbose: true,
    watch: [ 'client', 'server' ],
    script: 'index.js',
  })
    .on('restart', function(files) {
      console.log('App restarted due to: ', files);
    });
});

gulp.task('default', [ 'serve' ]);
