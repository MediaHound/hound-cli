#! /usr/bin/env node

var program = require('commander');
var version = require('version');

var controller = require('./lib/controller');

version.fetch(function(error, v) {
  if (error) {
    console.error(error);
    process.exit(1);
  }
  else {
    program
      .version(v)
      .description('Search for movies and where to watch them')
      .option('-m, --meets <query>', 'Find media that relates to this\'n\'that')
      .arguments('<query...>')
      .action(function(queryParams) {
        var mediaType = 'movie';
        var query = queryParams.join(' ');

        controller.configure().then(function() {
          if (program.meets) {
            controller.thisMeetsThat(query, program.meets, mediaType);
          }
          else {
            controller.query(query, mediaType);
          }
        });
      })
      .parse(process.argv);

    if (!program.args.length) {
      program.help();
    }
  }
});
