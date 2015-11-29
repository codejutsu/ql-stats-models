var Promise = require('bluebird'),
    expect = require('chai').expect,
    helper = require('../helper'),
    GameStats;

describe('Game Stats Unit Test.', function () {

    before(function (done) {
        function setDependencies (db) {
            GameStats = db.model('GameStats');
        }

        function setupScenario () {
            return Promise.all([])
        }

        helper.before()
            .then(setDependencies)
            .then(setupScenario)
            .then(function () {
                done();
            });
    });

    after(helper.after);


    it('should be able to create or update the match report with match report data', function (done) {

        GameStats.createWithMatchStarted(helper.events.playerStats)
            .then(function (gameStats) {
                expect(gameStats._id).not.to.equal(null);
                done();
            });

    });

      it('should be able to increment with a GameStats object', function (done) {

        GameStats.createWithMatchStarted(helper.events.playerStats)
            .then(function (originalGameStats) {
                originalGameStats.incrementWithGameStats(originalGameStats)
                    .then(function (status) {
                        expect(status.ok).to.equal(1);
                        GameStats.findById(originalGameStats._id).then(function (updateGameStats) {
                            expect(updateGameStats.win).to.equal(originalGameStats.win * 2);
                            expect(updateGameStats.damage_taken).to.equal(originalGameStats.damage_taken * 2);
                            done()
                        });

                    });

            });

    });
});