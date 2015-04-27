var model = require('../model');

describe('fmedia model', function() {
  beforeEach(function(done) {
    model.configure()
      .then(function() {
        done();
      });
  });

  describe('the search() method', function() {
    it('returns 10 movies', function(done) {
      model.search('toy story', 'movie')
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
      model.luckySearch('toy story', 'movie')
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
});
