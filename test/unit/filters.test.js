require('isomorphic-fetch');
require('babel-polyfill');

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
        name: 'Movie Name',
        releaseDate: 978307200
      };
      expect(filters.formattedMedia(media)).toBe('Movie Name (2001)');
    });
  });

  describe('the formattedContributor() method', function() {
    it('formats a contributo', function() {
      var person = {
        name: 'John Goodman'
      };
      expect(filters.formattedContributor(person)).toBe('John Goodman');
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
