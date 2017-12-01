var chalk = require('chalk');

var formattedContributor = function(contributor) {
  return chalk.green(contributor.name);
};

var formattedMedia = function(media) {
  return chalk.green(media.name) +
    ' ' +
    chalk.blue('(' + (new Date(media.releaseDate * 1000)).getUTCFullYear() + ')');
};

var formattedButton = function(button) {
  return chalk.red(button.source.name) +
    ' ' +
    chalk.white(button.pitch);
};

module.exports = {
  formattedContributor: formattedContributor,
  formattedMedia: formattedMedia,
  formattedButton: formattedButton
};
