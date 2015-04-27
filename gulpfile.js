// gulpfile.js
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');

gulp.task('lint', function() {
  return gulp.src(['./**/*.js', '!node_modules/**/*.js', '!ext/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('style', function() {
  return gulp.src(['./**/*.js', '!node_modules/**/*.js', '!ext/**/*.js'])
    .pipe(jscs());
});

gulp.task('default', ['lint', 'style']);
