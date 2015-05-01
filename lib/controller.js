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
        didYouMean(query, mediaType, {
          formatter: function(option) {
            return filters.formattedMedia(option);
          },

          prompt: 'Which movie?',
          selected: function(media) {
            showSourcesForMHObject(media);
          }
        });
      });
    });
};

var queryPerson = function(query, mediaType) {
  return model.luckySearch(query, 'person')
    .then(function(result) {
      // TODO: In the future, we can use mediaType here to filter
      // the types of contributions
      return showMoviesForContributor(result, function() {
        didYouMean(query, 'person', {
          formatter: function(option) {
            return filters.formattedContributor(option);
          },

          prompt: 'Which person?',
          selected: function(media) {
            showMoviesForContributor(media);
          }
        });
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

var showMoviesForContributor = function(contributor, otherwise) {
  ui.printContributorMedia(contributor);

  return model.mediaForContributor(contributor)
    .then(function(medias) {
      var mhobjs = medias.content.map(function(pair) {
        return pair.object;
      });

      var opts = {
        formatter: function(option) {
          return filters.formattedMedia(option);
        },

        prompt: 'Which movie?',
        empty: 'This person has not done any movies',
        selected: function(selectedMedia) {
          showSourcesForMHObject(selectedMedia);
        }
      };

      if (otherwise) {
        opts.alternate = 'Did you mean a different person?';
        opts.alternateSelected = otherwise;
      }

      ui.printChoices(mhobjs, opts);
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

var didYouMean = function(query, mediaType, options) {
  ui.printQueryResultsFound(query);

  return model.search(query, mediaType)
    .then(function(results) {
      ui.printChoices(results, options);
    });
};

module.exports = {
  configure: configure,
  thisMeetsThat: thisMeetsThat,
  query: query,
  queryPerson: queryPerson
};
