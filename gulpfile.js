// gulpfile.js
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var jasmine = require('gulp-jasmine');

var paths = {
  // All javascript source files
  src: [
    './**/*.js',
    '!node_modules/**/*.js',
    '!ext/**/*.js'
  ],
  test: {
    // All unit test files
    unit: [
      'test/unit/**/*.test.js'
    ]
  }
};

// Runs jshint across all javascript code
gulp.task('lint', function() {
  return gulp.src(paths.src)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

// Runs jscs (Style checker) across all javascript code
gulp.task('style', function() {
  return gulp.src(paths.src)
    .pipe(jscs());
});

// Runs unit tests (via Jasmine)
gulp.task('test:unit', function() {
  return gulp.src(paths.test.unit)
    .pipe(jasmine());
});

// Default gulp task will lint, style, and run unit tests.
gulp.task('default', ['lint', 'style', 'test:unit']);
