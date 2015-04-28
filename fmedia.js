var ui = require('./fmediaUI');
var filters = require('./filters');
var model = require('./model');

var configure = function() {
  ui.configureUI();

  return model.configure();
};

var query = function(query, mediaType) {
  return model.luckySearch(query, mediaType)
    .then(function(result) {
      return showSourcesForMHObject(result, function() {
        didYouMean(query, mediaType);
      });
    });
};

var showSourcesForMHObject = function(obj, otherwise) {
  ui.printMediaAvailable(obj);

  return model.sourceButtonsForMHObject(obj)
    .then(function(buttons) {
      ui.printChoices(buttons, {
        formatter: function(option) {
          return filters.formattedButton(option);
        },

        prompt: 'Which source?',
        empty: 'No sources',
        selected: function(button) {
          ui.openUrl(button.url);
        },

        alternate: 'Did you mean a different movie?',
        alternateSelected: function() {
          otherwise();
        }
      });
    });
};

var didYouMean = function(query, mediaType) {
  ui.printQueryResultsFound(query);

  return model.search(query, mediaType)
    .then(function(results) {
      ui.printChoices(results, {
        formatter: function(option) {
          return filters.formattedMedia(option);
        },

        prompt: 'Which movie?',
        selected: function(media) {
          showSourcesForMHObject(media, function() {
            didYouMean(query, mediaType);
          });
        }
      });
    });
};

module.exports = {
  configure: configure,
  query: query,
  showSourcesForMHObject: showSourcesForMHObject,
  didYouMean: didYouMean
};
