var filters = require('../../lib/filters');

var chalk = require('chalk');

describe('hound filters', function() {
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

  describe('the formattedContributor() method', function() {
    it('formats a contributo', function() {
      var person = {
        metadata: {
          name: 'John Goodman'
        }
      };
      expect(filters.formattedContributor(person)).toBe('John Goodman');
    });
  });

  describe('the formattedButton() method', function() {
    it('returns only one movie', function() {
      var button = {
        pitch: 'A Sample Pitch',
        source: {
          metadata: {
            name: 'A Source Name'
          }
        }
      };
      expect(filters.formattedButton(button)).toBe('A Source Name A Sample Pitch');
    });
  });
});
