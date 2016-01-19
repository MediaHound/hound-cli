#! /usr/bin/env node

var program = require('commander');
var version = require('program-version');

var controller = require('./lib/controller');
var MHSearch = require('houndjs').MHSearch;

program
  .version(version('%(version)s'))
  .description('Search for movies and where to watch them')
  .option('-w, --with', 'Search for media with a person')
  .option('-m, --meets <query>', 'Find media that relates to this\'n\'that')
  .arguments('<query...>')
  .action(function(queryParams) {
    if (program.with && program.meets) {
      console.log('Invalid parameters: Cannot use --with and --meets at the same time.');
      process.exit(1);
    }

    var query = queryParams.join(' ');
    var scopes = [MHSearch.SCOPE_MOVIE];

    controller.configure()
      .then(function() {
        if (program.meets) {
          controller.thisMeetsThat(query, program.meets, scopes);
        }
        else {
          if (program.with) {
            controller.queryPerson(query, scopes);
          }
          else {
            controller.query(query, scopes);
          }
        }
      })
      .catch(function(err) {
        console.log('hound-cli: failed connection');
      });
  })
  .parse(process.argv);

if (!program.args.length) {
  program.help();
}
