var hound = require('houndjs');

var buttonsForSources = function(sourcesResponse) {
  var buttons = [];
  sourcesResponse.content.forEach(function(sourcePair) {
    var source = sourcePair.object;
    var context = sourcePair.context;

    //we skip sources like rotten tomatoes that don't have mediums here
    if (context.mediums) {
      context.mediums.forEach(function(medium) {
        medium.methods.forEach(function(method) {
          var format = method.formats[0];
          var formattedPrice = '$' + format.price;
          var pitch;

          var isSeries = false;
          var countInfo;
          if (format.contentCount) {
            if (format.contentCount === 1) {
              countInfo = format.contentCount + ' season';
            }
            else {
              countInfo = format.contentCount + ' seasons';
            }
          }
          else {
            countInfo = '';
          }

          switch (medium.type) {
            case 'download':
              if (method.type === 'purchase') {
                if (isSeries) {
                  pitch = 'Buy ' + countInfo;
                }
                else {
                  pitch = 'Buy from ' + formattedPrice;
                }
              }
              else {
                if (isSeries) {
                  pitch = 'Rent ' + countInfo;
                }
                else {
                  pitch = 'Rent from ' + formattedPrice;
                }
              }

              break;
            case 'stream':
              if (method.type === 'adSupported') {
                if (isSeries) {
                  pitch = 'Watch ' + countInfo;
                }
                else {
                  pitch = 'Watch with ads';
                }
              }
              else if (method.type === 'subscription') {
                if (source.name === 'Hulu') {
                  if (isSeries) {
                    pitch = 'Watch ' + countInfo;
                  }
                  else {
                    pitch = 'Watch with Plus';
                  }
                }
                else {
                  if (isSeries) {
                    pitch = 'Watch ' + countInfo;
                  }
                  else {
                    pitch = 'Watch Now';
                  }
                }
              }
              else if (method.type === 'purchase') {
                if (isSeries) {
                  pitch = 'Buy ' + countInfo;
                }
                else {
                  pitch = 'Buy from ' + formattedPrice;
                }
              }
              else if (method.type === 'rental' || method.type === 'rent') {
                if (isSeries) {
                  pitch = 'Rent ' + countInfo;
                }
                else {
                  pitch = 'Rent from ' + formattedPrice;
                }
              }
              else if (method.type === 'broker') {
                if (isSeries) {
                  pitch = 'Watch ' + countInfo;
                }
                else {
                  pitch = 'Watch Now';
                }
              }

              break;

            case 'deliver':
              if (isSeries) {
                pitch = 'Watch ' + countInfo;
              }
              else {
                pitch = 'Watch on ' + format.type;
              }

              break;

            case 'pickup':
              if (method.type === 'rental' || method.type === 'rent') {
                if (isSeries) {
                  pitch = 'Rent ' + countInfo;
                }
                else {
                  pitch = 'Rent for ' + formattedPrice;
                }
              }
              else if (method.type === 'purchase') {
                pitch = 'Buy tickets';
              }

              break;

            default:
              if (isSeries) {
                pitch = 'Watch ' + countInfo;
              }
              else {
                pitch = 'Watch It';
              }

              break;

          }
          buttons.push({
            pitch: pitch,
            url: format.launchInfo.view.http,
            source: source
          });
        });
      });
    }
  });

  return buttons;
};

var sourceButtonsForMHObject = function(obj) {
  return hound.lookup({
      ids: [obj.mhid],
      components: ['sources']
    })
    .then(function(res) {
      var sources = res.content[0].object.sources;

      return buttonsForSources(sources);
    });
};

var relatedForMHObjects = function(firstObj, secondObj) {
  return hound.relate({
      factors: [
        firstObj.mhid,
        secondObj.mhid
      ],
      filters: {
        returnType: {
          $eq: 'movie'
        }
      }
    })
    .then(function(res) {
      return res.content.map(function(pair) {
        return pair.object;
      });
    });
};

var mediaForContributor = function(contributor) {
  return hound.explore({
      filters: {
        contributors: {
          $eq: contributor.mhid
        },
        returnType: {
          $eq: 'movie'
        }
      }
    })
    .then(function(res) {
      return res.content
        .map(function(pair) {
          return pair.object;
        });
    });
};

var search = function(query, scopes) {
  return hound.search.all({
      searchTerm: query,
      scopes: scopes,
      pageSize: 10
    })
    .then(function(results) {
      if (results.length < 1) {
        throw 'not found';
      }
      else {
        return results.content.map(function(pair) {
          return pair.object;
        });
      }
    });
};

var luckySearch = function(query, scopes) {
  return search(query, scopes)
    .then(function(results) {
      return results[0];
    });
};

var configure = function() {
  return hound.sdk.configure({
    clientId: 'mhclt_fMediaCLI',
    clientSecret: 'IzyHwiU9t1n0hJtst10AKd6mW5QDFJAByBGdoTEXn9JXjI9m'
  });
};

module.exports = {
  configure: configure,
  search: search,
  luckySearch: luckySearch,
  sourceButtonsForMHObject: sourceButtonsForMHObject,
  buttonsForSources: buttonsForSources,
  relatedForMHObjects: relatedForMHObjects,
  mediaForContributor: mediaForContributor
};
