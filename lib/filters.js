var chalk = require('chalk');

var formattedContributor = function(contributor) {
  return chalk.green(contributor.metadata.name);
};

var formattedMedia = function(media) {
  return chalk.green(media.metadata.name) +
    ' ' +
    chalk.blue('(' + media.metadata.releaseDate.getFullYear() + ')');
};

var formattedButton = function(button) {
  return chalk.red(button.source.metadata.name) +
    ' ' +
    chalk.white(button.pitch);
};

module.exports = {
  formattedContributor: formattedContributor,
  formattedMedia: formattedMedia,
  formattedButton: formattedButton
};
