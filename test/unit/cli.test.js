var nexpect = require('nexpect');

describe('the hound CLI', function() {

  describe('searching for a movie', function() {
    it('shows the sources when searching for a one-word movie', function(done) {
      nexpect
        .spawn('node ./houndcli.js gladiator', { stripColors: true })
        .sendEof()
        .run(function(err, stdout, exitcode) {
          expect(stdout[0]).toMatch(/.* \(.*\) is available on:/);
          for (var i = 1; i < stdout.length - 3; i++) {
            expect(stdout[i]).toMatch(new RegExp('^' + i + '\\) '));
          }

          expect(stdout[stdout.length - 3]).toMatch(/or/);
          expect(stdout[stdout.length - 2]).toMatch(/.\) Did you mean a different movie\?/);
          expect(stdout[stdout.length - 1]).toMatch(/\?: Which source\?:/);
          expect(exitcode).toBe(0);
          done();
        });
    });

    it('shows the sources when searching for a multi-word movie', function(done) {
      nexpect
        .spawn('node ./houndcli.js toy story', { stripColors: true })
        .sendEof()
        .run(function(err, stdout, exitcode) {
          expect(stdout[0]).toMatch(/.* \(.*\) is available on:/);
          for (var i = 1; i < stdout.length - 3; i++) {
            expect(stdout[i]).toMatch(new RegExp('^' + i + '\\) '));
          }

          expect(stdout[stdout.length - 3]).toMatch(/or/);
          expect(stdout[stdout.length - 2]).toMatch(/.\) Did you mean a different movie\?/);
          expect(stdout[stdout.length - 1]).toMatch(/\?: Which source\?:/);
          expect(exitcode).toBe(0);
          done();
        });
    });
  });

  describe('the utility parameters', function() {
    it('exits with failure when passing --meets and --with at the same time', function(done) {
      nexpect
        .spawn('node ./houndcli.js --with john --meets gladiator', { stripColors: true })
        .run(function(err, stdout, exitcode) {
          expect(stdout[0]).toBe('Invalid parameters: Cannot use --with and --meets at the same time.');
          expect(exitcode).toBe(1);
          done();
        });
    });

    it('prints version when passing --version', function(done) {
      nexpect
        .spawn('node ./houndcli.js --version', { stripColors: true })
        .run(function(err, stdout, exitcode) {
          expect(stdout[0]).toMatch(/\d\.\d\.\d/);
          expect(exitcode).toBe(0);
          done();
        });
    });

    it('prints help when passing --help', function(done) {
      nexpect
        .spawn('node ./houndcli.js --help', { stripColors: true })
        .run(function(err, stdout, exitcode) {
          expect(stdout[0]).toMatch(/Usage: hound/);
          expect(exitcode).toBe(0);
          done();
        });
    });

    it('prints help when passing no parameters at all', function(done) {
      nexpect
        .spawn('node ./houndcli.js', { stripColors: true })
        .run(function(err, stdout, exitcode) {
          expect(stdout[0]).toMatch(/Usage: hound/);
          expect(exitcode).toBe(0);
          done();
        });
    });
  });
});
