var chalk = require('chalk');

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
  formattedMedia: formattedMedia,
  formattedButton: formattedButton
};
