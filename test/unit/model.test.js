require('isomorphic-fetch');
require('babel-polyfill');

var model = require('../../lib/model');

describe('hound model', function() {
  beforeEach(function(done) {
    model.configure()
      .then(function() {
        done();
      });
  });

  describe('the search() method', function() {
    it('returns 10 movies', function(done) {
      model.search('toy', ['movie'])
        .then(function(res) {
          expect(res.length).toBe(10);
          res.forEach(function(movie) {
            expect(movie.mhid.slice(0, 5)).toBe('mhmov');
          });

          done();
        });
    });
  });

  describe('the luckySearch() method', function() {
    it('returns only one movie', function(done) {
      model.luckySearch('toy story', ['movie'])
        .then(function(res) {
          expect(res.mhid.slice(0, 5)).toBe('mhmov');
          done();
        });
    });

    it('returns the first movie of the search() request', function(done) {
      model.luckySearch('toy story', 'movie')
        .then(function(luckyRes) {
          model.search('toy story', 'movie')
            .then(function(searchRes) {
              expect(luckyRes.mhid).toBe(searchRes[0].mhid);
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
              name: 'Netflix'
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
        name: 'Vudu'
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
        name: 'Netflix'
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
