// gulpfile.js
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var jasmine = require('gulp-jasmine');

gulp.task('lint', function() {
  return gulp.src(['./**/*.js', '!node_modules/**/*.js', '!ext/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('style', function() {
  return gulp.src(['./**/*.js', '!node_modules/**/*.js', '!ext/**/*.js'])
    .pipe(jscs());
});

gulp.task('test', function() {
  return gulp.src('test/**/*.test.js')
    .pipe(jasmine());
});

gulp.task('default', ['lint', 'style', 'test']);
