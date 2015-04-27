#! /usr/bin/env node

var fmedia = require('./fmedia');

var main = function() {
  fmedia.configure().then(function() {
    var args = process.argv.slice(2);

    var mediaType = 'movie';
    var query = args.join(' ');

    if (args.length === 0) {
      fmedia.usage();
    }
    else if (query === '--version' || query === '-v') {
      fmedia.version();
    }
    else {
      fmedia.query(query, mediaType);
    }
  });
};

main();
