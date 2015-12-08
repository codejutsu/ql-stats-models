var Promise = require('bluebird'),
    expect = require('chai').expect,
    helper = require('../helper'),
    Player,
    MatchReport,
    PlayerMatchStats;

describe('Match Report Unit Test.', function () {

    before(function (done) {
        function setDependencies (db) {
            Player = db.model('Player');
            MatchReport = db.model('MatchReport');
            PlayerMatchStats = db.model('PlayerMatchStats');
        }

        function setupScenario() {
            return Promise.all([
                Player.findOrCreateBySteamId(helper.events.playerStats.DATA.STEAM_ID),
                Player.findOrCreateBySteamId(helper.events.playerStats2.DATA.STEAM_ID)
            ])
        }

        helper.before()
            .then(setDependencies)
            .then(setupScenario)
            .then(function () {
                done();
            });
    });

    after(helper.after);

    it('should be able to create a match report', function (done) {
        MatchReport.createWithMatchStarted(helper.events.matchStarted)
            .then(function (match) {
                expect(match._id).not.to.equal(null);
                done()
            });
    });


    it('should be able to update and add reference to player match stats document', function (done) {



        Promise.all([
            PlayerMatchStats.createWithPlayerStats(helper.events.playerStats).then(),
            PlayerMatchStats.createWithPlayerStats(helper.events.playerStats2).then()
        ]).spread(function () {
            MatchReport.findByMatchGuid(helper.events.matchReport.DATA.MATCH_GUID)
                .then(function () {
                    MatchReport.updateWithMatchReport(helper.events.matchReport)
                        .then(function (r) {
                            expect(r.ok).to.equal(1);
                            expect(r.n).to.equal(1);
                            MatchReport.findByMatchGuid(helper.events.matchReport.DATA.MATCH_GUID)
                                .then(function (r) {
                                    expect(r.player_match_stats.length).to.equal(2);
                                    done();
                                });
                        });
                })


        });

    });

});