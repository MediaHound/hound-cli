var filters = require('./filters');

var chalk = require('chalk');
var prompt = require('prompt');
var open = require('open');
var _defaults = require('lodash.defaults');

var configureUI = function() {
  prompt.message = '?';
  prompt.start();
};

var printMediaAvailable = function(media) {
  console.log(
    filters.formattedMedia(media),
    chalk.white('is available on:')
  );
};

var printContributorMedia = function(contributor) {
  console.log(
    filters.formattedContributor(contributor),
    chalk.white('has done:')
  );
};

var printRelatedForMedia = function(firstMedia, secondMedia) {
  console.log(
    chalk.white('Looking for:'),
    filters.formattedMedia(firstMedia),
    chalk.white('meets'),
    filters.formattedMedia(secondMedia)
  );
};

var printQueryResultsFound = function(query) {
  console.log(
    chalk.white('Results for:'),
    chalk.red(query)
  );
};

var printChoices = function(choices, options) {
  options = _defaults({}, options, {
    empty: 'Nothing',
    formatter: function(option) {
      console.log(option);
    }
  });

  var optionNum = 1;
  if (choices.length > 0) {
    choices.forEach(function(option) {
      console.log(
        chalk.gray(optionNum + ')'),
        options.formatter(option)
      );
      optionNum++;
    });
  }
  else {
    console.log(chalk.gray(options.empty));
  }

  if (options.alternate) {
    console.log(chalk.gray('or'));
    console.log(
      chalk.gray(optionNum + ')'),
      chalk.red(options.alternate)
    );
    optionNum++;
  }

  if (options.prompt) {
    var property = {
      name: 'number',
      message: options.prompt,
      warning: 'Must be a number.',
      conform: function(n) {
        return n > 0 && n < optionNum;
      }
    };
    prompt.get(property, function(err, result) {
      if (!err) {
        if (options.alternate && (result.number == optionNum - 1)) {
          options.alternateSelected();
        }
        else {
          options.selected(choices[result.number - 1]);
        }
      }
    });
  }
};

var openUrl = function(url) {
  open(url);
};

module.exports = {
  configureUI: configureUI,
  printMediaAvailable: printMediaAvailable,
  printContributorMedia: printContributorMedia,
  printRelatedForMedia: printRelatedForMedia,
  printQueryResultsFound: printQueryResultsFound,
  printChoices: printChoices,
  openUrl: openUrl
};
