#! /usr/bin/env node

var program = require('commander');
var version = require('version');
var fmedia = require('./fmedia');

version.fetch(function(error, v) {
  if (error) {
    console.error(error);
    process.exit(1);
  }
  else {
    program
      .version(v)
      .description('Search for movies and where to watch them')
      .arguments('<query...>')
      .action(function (queryParams) {
        var mediaType = 'movie';
        var query = queryParams.join(' ');

        fmedia.configure().then(function() {
          fmedia.query(query, mediaType);
        });
      })
      .parse(process.argv);

    if (!program.args.length) {
      program.help();
    }
  };
});
