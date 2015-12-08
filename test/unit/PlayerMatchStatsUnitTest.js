var Promise = require('bluebird'),
    expect = require('chai').expect,
    helper = require('../helper'),
    PlayerMatchStats,
    MatchReport,
    Player;

describe('When using the PlayerMatchStats', function () {

    var match_guid = helper.events.matchStarted.DATA.MATCH_GUID,
        steamId = helper.events.playerStats.DATA.STEAM_ID,
        steamId2 = helper.events.playerStats2.DATA.STEAM_ID;

    before(function (done) {
        function setDependencies (db) {
            PlayerMatchStats = db.model('PlayerMatchStats');
            MatchReport = db.model('MatchReport');
            Player = db.model('Player');
        }

        function setupScenario () {
            return Promise.all([
                MatchReport.createWithMatchStarted(helper.events.matchStarted).then(),
                Player.findOrCreateBySteamId(steamId).then(),
                Player.findOrCreateBySteamId(steamId2).then()
            ])
        }

        helper.before()
            .then(setDependencies)
            .then(setupScenario).then(function () {
            done();
        });
    });

    after(helper.after);

    it('should be able to create player match stats with player stats event data', function (done) {

        function evaluatePlayerMatchStats (playerMatchStats) {
            expect(playerMatchStats.match_guid).to.equal(match_guid);
            expect(playerMatchStats.steam_id).to.equal(steamId);
        }

        PlayerMatchStats.createWithPlayerStats(helper.events.playerStats)
            .then(evaluatePlayerMatchStats)
            .then(done);
    });


    it('should be able to get multiple player match stats by guid', function (done) {
        PlayerMatchStats.createWithPlayerStats(helper.events.playerStats2)
            .then(function () {
                PlayerMatchStats.findByMatchGuid(helper.events.playerStats2.DATA.MATCH_GUID)
                    .then(function (playerMatchStats) {
                        expect(playerMatchStats.length).to.equal(2);
                        done();
                    })
            });

    });
});