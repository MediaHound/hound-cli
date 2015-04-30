var ui = require('./ui');
var filters = require('./filters');
var model = require('./model');

var configure = function() {
  ui.configureUI();

  return model.configure();
};

var thisMeetsThat = function(firstQuery, secondQuery, mediaType) {
  return model.luckySearch(firstQuery, mediaType)
    .then(function(firstMedia) {
      return model.luckySearch(secondQuery, mediaType)
        .then(function(secondMedia) {
          return showRelatedForMedia(firstMedia, secondMedia, function() {
            // TODO:
            console.log('FEATURE COMING SOON');
          });
        });
    });
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
      var opts = {
        formatter: function(option) {
          return filters.formattedButton(option);
        },

        prompt: 'Which source?',
        empty: 'No sources',
        selected: function(button) {
          ui.openUrl(button.url);
        }
      };

      if (otherwise) {
        opts.alternate = 'Did you mean a different movie?';
        opts.alternateSelected = otherwise;
      }

      ui.printChoices(buttons, opts);
    });
};

var showRelatedForMedia = function(firstMedia, secondMedia, otherwise) {
  ui.printRelatedForMedia(firstMedia, secondMedia);

  return model.relatedForMHObjects(firstMedia, secondMedia)
    .then(function(relatedMedia) {
      var mhobjs = relatedMedia.content.map(function(pair) {
        return pair.object;
      });

      ui.printChoices(mhobjs, {
        formatter: function(option) {
          return filters.formattedMedia(option);
        },

        prompt: 'Which movie?',
        empty: 'No related media',
        selected: function(selectedMedia) {
          showSourcesForMHObject(selectedMedia);
        },

        alternate: 'Did you mean different movies to start with?',
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
          showSourcesForMHObject(media);
        }
      });
    });
};

module.exports = {
  configure: configure,
  thisMeetsThat: thisMeetsThat,
  query: query,
  didYouMean: didYouMean
};
