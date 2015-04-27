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
    formattedMedia(media),
    chalk.white('is available on:')
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

var formattedMedia = function(media) {
  return chalk.green(media.metadata.name) +
    ' ' +
    chalk.blue('(' + media.metadata.releaseDate.getFullYear() + ')');
};

var formattedButton = function(button) {
  return chalk.red(button.source.name) +
    ' ' +
    chalk.white(button.pitch);
};

module.exports = {
  configureUI: configureUI,
  printMediaAvailable: printMediaAvailable,
  printQueryResultsFound: printQueryResultsFound,
  printChoices: printChoices,
  openUrl: openUrl,
  formattedMedia: formattedMedia,
  formattedButton: formattedButton
};
