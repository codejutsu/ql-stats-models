var Promise = require('bluebird'),
    expect = require('chai').expect,
    helper = require('../helper'),
    Player,
    PlayerMatchStats,
    MatchReport,
    GlobalStats,
    GameStats;

describe('PLAYER_STATS - When processing player stats events', function () {

    before(function (done) {
        function setDependencies (db) {
            Player = db.model('Player');
            PlayerMatchStats = db.model('PlayerMatchStats');
            MatchReport = db.model('MatchReport');
            GameStats = db.model('GameStats');
            GlobalStats = db.model('GlobalStats');
        }

        function createGlobalStats () {
            var globalStats = new GlobalStats({
                game_stats: {
                    overall: new GameStats({
                        win: 4
                    }),
                    duel: new GameStats({
                        win: 14
                    })
                }
            });

            return Promise.all([
                globalStats.game_stats.overall.save().then(),
                globalStats.game_stats.duel.save().then(),
                globalStats.save().then()
            ])
        }


        function setupScenario () {
            return Promise.all([
                Player.findOrCreateBySteamId(helper.events.playerStats.DATA.STEAM_ID),
                Player.findOrCreateBySteamId(helper.events.playerStats2.DATA.STEAM_ID),
                MatchReport.createWithMatchStarted(helper.events.matchStarted),
                createGlobalStats()
            ]).then(function (results) {
            }, function (r) {
                console.error(r);
            });
        }

        helper.before()
            .then(setDependencies)
            .then(setupScenario).then(function () {
            done();
        });
    });

    after(helper.after);


    it('should be able to create a player match stats document with steam id: 76561198013158463', function (done) {

        PlayerMatchStats.createWithPlayerStats(helper.events.playerStats)
            .then(function (doc) {
                _playerMatchStats = doc;
                expect(doc.match_guid).to.equal('cb850666-d5e8-4310-b93b-1083fc26f658');
                expect(doc.steam_id).to.equal('76561198013158463');
                expect(doc.game_stats).not.to.equal(null);
                expect(doc.player).not.to.equal(null);
                expect(doc._id).not.to.equal(null);
                done();
            });

    });

    it('should be able to create a player match stats document with steam id: 76561198000636434', function (done) {

        PlayerMatchStats.createWithPlayerStats(helper.events.playerStats2)
            .then(function (doc) {
                _playerMatchStats = doc;
                expect(doc.match_guid).to.equal('cb850666-d5e8-4310-b93b-1083fc26f658');
                expect(doc.steam_id).to.equal('76561198000636434');
                expect(doc.game_stats).not.to.equal(null);
                expect(doc.player).not.to.equal(null);
                expect(doc._id).not.to.equal(null);
                done();
            });

    });

    it('should fail if trying to save a player stats document that has WARMUP  set to true', function (done) {

        PlayerMatchStats.createWithPlayerStats(helper.events.playerStatsWarmup)
            .catch(function (err) {
                expect(err.message).to.equal('PlayerMatchStats validation failed');
                done();
            });


    });


});
