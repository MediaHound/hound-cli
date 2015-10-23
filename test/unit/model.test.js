var model = require('../../lib/model');
var MHSearch = require('houndjs').MHSearch;

describe('hound model', function() {
  beforeEach(function(done) {
    model.configure()
      .then(function() {
        done();
      });
  });

  describe('the search() method', function() {
    it('returns 10 movies', function(done) {
      model.search('toy', [MHSearch.SCOPE_MOVIE])
        .then(function(res) {
          expect(res.length).toBe(10);
          res.forEach(function(movie) {
            expect(movie.className).toBe('MHMovie');
          });

          done();
        });
    });
  });

  describe('the luckySearch() method', function() {
    it('returns only one movie', function(done) {
      model.luckySearch('toy story', [MHSearch.SCOPE_MOVIE])
        .then(function(res) {
          expect(res.className).toBe('MHMovie');
          done();
        });
    });

    it('returns the first movie of the search() request', function(done) {
      model.luckySearch('toy story', 'movie')
        .then(function(luckyRes) {
          model.search('toy story', 'movie')
            .then(function(searchRes) {
              expect(luckyRes.metadata.mhid).toBe(searchRes[0].metadata.mhid);
              done();
            });
        });
    });
  });

  describe('the buttonsForSources() method', function() {
    it('returns no buttons when sources is empty', function() {
      expect(model.buttonsForSources({ content: [] })).toEqual([]);
    });

    it('returns no button for a source that has no mediums', function() {
      var sources = {
        content: [
          {
            object: {
              metadata: {
                name: 'Netflix'
              }
            },
            context: {

            }
          }
        ]
      };
      expect(model.buttonsForSources(sources)).toEqual([]);
    });

    it('returns one button per source method-medium pair', function() {
      var vuduObject = {
        metadata: {
          name: 'Vudu'
        }
      };
      var vuduPair = {
        object: vuduObject,
        context: {
          mediums: [
            {
              type: 'download',
              methods: [
                {
                  type: 'purchase',
                  formats: [
                    {
                      price: '5.99',
                      launchInfo: {
                        view: {
                          http: 'http://vudu.com/1234'
                        }
                      }
                    }
                  ]
                }
              ]
            }
          ]
        }
      };
      var nflixObject = {
        metadata: {
          name: 'Netflix'
        }
      };
      var nflixPair = {
        object: nflixObject,
        context: {
          mediums: [
            {
              type: 'stream',
              methods: [
                {
                  type: 'subscription',
                  formats: [
                    {
                      launchInfo: {
                        view: {
                          http: 'http://netflix.com/5678'
                        }
                      }
                    }
                  ]
                }
              ]
            }
          ]
        }
      };
      var sources = {
        content: [
          vuduPair,
          nflixPair
        ]
      };
      expect(model.buttonsForSources(sources)).toEqual([
        {
          source: vuduObject,
          pitch: 'Buy from $5.99',
          url: 'http://vudu.com/1234'
        },
        {
          source: nflixObject,
          pitch: 'Watch Now',
          url: 'http://netflix.com/5678'
        }
      ]);
    });
  });
});
