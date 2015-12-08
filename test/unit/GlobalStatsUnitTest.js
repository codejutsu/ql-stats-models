var Promise = require('bluebird'),
    expect = require('chai').expect,
    helper = require('../helper'),
    GlobalStats;

describe('Global Stats Unit Test.', function () {

    before(function (done) {
        function setDependencies (db) {
            GlobalStats = db.model('GlobalStats');
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


    it('should be able to find or create a global stats document', function (done) {

        function evaluate(globalStats) {
            Object.keys(globalStats.game_stats.toObject()).forEach(function (key) {
                expect(globalStats.game_stats[key].count).to.equal(0);
            });
        }

        GlobalStats.findOrCreate()
            .then(evaluate)
            .then(done);

    });

});