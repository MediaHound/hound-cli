var ui = require('./ui');
var filters = require('./filters');
var model = require('./model');

var Promise = require('bluebird');
var MHSearch = require('houndjs').MHSearch;

var configure = function() {
  ui.configureUI();

  return model.configure();
};

var thisMeetsThat = function(firstQuery, secondQuery, scopes) {
  Promise.join(
    model.luckySearch(firstQuery, scopes),
    model.luckySearch(secondQuery, scopes),
    function(firstMedia, secondMedia) {
      showRelatedForMedia(firstMedia, secondMedia, function() {
        didYouMean(firstQuery, scopes, {
          formatter: filters.formattedMedia,
          prompt: 'Which first movie did you mean?',
          selected: function(firstSelectedMedia) {
            didYouMean(secondQuery, scopes, {
              formatter: filters.formattedMedia,

              prompt: 'Which second movie did you mean?',
              selected: function(secondSelectedMedia) {
                showRelatedForMedia(firstSelectedMedia, secondSelectedMedia);
              }
            });
          }
        });
      });
    });
};

var query = function(query, scopes) {
  model
    .luckySearch(query, scopes)
    .then(function(result) {
      showSourcesForMHObject(result, function() {
        didYouMean(query, scopes, {
          formatter: filters.formattedMedia,
          prompt: 'Which movie?',
          selected: function(media) {
            showSourcesForMHObject(media);
          }
        });
      });
    });
};

var queryPerson = function(query, scopes) {
  model
    .luckySearch(query, [MHSearch.SCOPE_CONTRIBUTOR])
    .then(function(result) {
      // TODO: In the future, we can use scopes here to filter
      // the types of contributions
      showMoviesForContributor(result, function() {
        didYouMean(query, [MHSearch.SCOPE_CONTRIBUTOR], {
          formatter: filters.formattedContributor,
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
  model
    .sourceButtonsForMHObject(obj)
    .then(function(buttons) {
      var opts = {
        formatter: filters.formattedButton,
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

  model
    .mediaForContributor(contributor)
    .then(function(medias) {
      var opts = {
        formatter: filters.formattedMedia,
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

      ui.printChoices(medias, opts);
    });
};

var showRelatedForMedia = function(firstMedia, secondMedia, otherwise) {
  ui.printRelatedForMedia(firstMedia, secondMedia);

  model
    .relatedForMHObjects(firstMedia, secondMedia)
    .then(function(relatedMedia) {
      var opts = {
        formatter: filters.formattedMedia,
        prompt: 'Which movie?',
        empty: 'No related media',
        selected: function(selectedMedia) {
          showSourcesForMHObject(selectedMedia);
        }
      };

      if (otherwise) {
        opts.alternate = 'Did you mean different movies to start with?';
        opts.alternateSelected = otherwise;
      }

      ui.printChoices(relatedMedia, opts);
    });
};

var didYouMean = function(query, scopes, options) {
  ui.printQueryResultsFound(query);

  return model
    .search(query, scopes)
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
