var houndApi = require('./ext/hound-api');
var MHSDK = houndApi.models.MHSDK;
var MHObject = houndApi.models.MHObject;
var MHSearch = houndApi.quickSearch;
var MHSourceModel = houndApi.models.MHSourceModel;

var sourceButtonsForMHObject = function(obj) {
  return MHSourceModel.fetchAllSources().then(function(sourceMap) {
    return obj.fetchSources().then(function(sources) {
      var option = 1;
      var buttons = [];
      sources.forEach(function(source) {
        //we skip sources like rotten tomatoes that don't have mediums here
        if (source.mediums) {
          source.mediums.forEach(function(medium) {
            medium.methods.forEach(function(method) {
              var format = method.formats[0];
              var formattedPrice = format.price;
              var pitch;

              switch (medium.type){
                case 'download':
                  if (method.type === 'purchase') {
                    pitch = 'Buy from ' + formattedPrice;
                  }
                  else {
                    pitch = 'Rent from ' + formattedPrice;
                  }

                  break;
                case 'stream':
                  if (method.type === 'adSupported') {
                    pitch = 'Watch with ads';
                  }
                  else if (method.type === 'subscription') {
                    if (source.name === 'Hulu') {
                      pitch = 'Watch with Plus';
                    }
                    else {
                      pitch = 'Watch Now';
                    }
                  }
                  else if (method.type === 'purchase') {
                    pitch = 'Buy from ' + formattedPrice;
                  }
                  else if (method.type === 'rental') {
                    pitch = 'Rent from ' + formattedPrice;
                  }

                  break;

                case 'deliver':
                  pitch = 'Watch on ' + format.type;
                  break;

                default:
                  pitch = 'Watch It';
                  break;
              }
              buttons.push({
                pitch: pitch,
                medium: format.type,
                price: format.price,
                url: format.launchInfo.view.http,
                source: source
              });
            });
          });
        }
      });

      return buttons;
    });
  });
};

var search = function(query, mediaType) {
  return MHSearch.type(query, 10, mediaType)
    .then(function(results) {
      if (results.length < 1) {
        throw 'not found';
      }
      else {
        return results;
      }
    });
};

var luckySearch = function(query, mediaType) {
  return search(query, mediaType)
    .then(function(results) {
      return results[0];
    });
};

var configure = function() {
  return MHSDK.configure(
    'mhclt_FindDotMedia',
    '5F15tfhY81swUFtPQNzcMoplqJPsqyYjRKAzJJsJ9gJKtu7O'
  );
};

module.exports = {
  configure: configure,
  search: search,
  luckySearch: luckySearch,
  sourceButtonsForMHObject: sourceButtonsForMHObject
};
