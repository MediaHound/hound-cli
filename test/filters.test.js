var chalk = require('chalk');
var filters = require('../filters');

describe('fmedia filters', function() {
  beforeEach(function() {
    chalk.enabled = false;
  });

  afterEach(function() {
    chalk.enabled = true;
  });

  describe('the formattedMedia() method', function() {
    it('formats a media', function() {
      var media = {
        metadata: {
          name: 'Movie Name',
          releaseDate: new Date(2001, 5, 20)
        }
      };
      expect(filters.formattedMedia(media)).toBe('Movie Name (2001)');
    });
  });

  describe('the formattedButton() method', function() {
    it('returns only one movie', function() {
      var button = {
        pitch: 'A Sample Pitch',
        source: {
          name: 'A Source Name'
        }
      };
      expect(filters.formattedButton(button)).toBe('A Source Name A Sample Pitch');
    });
  });
});
