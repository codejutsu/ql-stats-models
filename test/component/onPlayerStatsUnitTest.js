var Promise = require('bluebird'),
    expect = require('chai').expect,
    helper = require('../helper'),
    Player,
    PlayerMatchStats,
    MatchReport,
    GlobalStats,
    GameStats;


// create game stats document
// create players stats document
// update match report players list with this document
// update player stats
// update global stats

describe('PLAYER_STATS - When processing player stats events', function () {

    var _player,
        _globalStats,
        _playerMatchStats;

    before(function (done) {
        function setDependencies (db) {
            Player = db.model('Player');
            PlayerMatchStats = db.model('PlayerMatchStats');
            MatchReport = db.model('MatchReport');
            GameStats = db.model('GameStats');
            GlobalStats = db.model('GlobalStats');
        }

        function createPlayer (steam_id) {
            var player = new Player({
                steam_id: steam_id,
                game_rank: {
                    duel: 1200
                },
                game_stats: {
                    overall: new GameStats({
                        win: 1337,
                        kills: 16
                    }),
                    duel: new GameStats({
                        win: 15
                    })
                }
            });

            return Promise.all([
                player.game_stats.overall.save().then(),
                player.game_stats.duel.save().then(),
                player.save().then()
            ]);
        }

        function createGlobalStats () {
            var globalStats = new GlobalStats({
                game_stats: {
                    overall: new GameStats({
                        win:4
                    }),
                    duel: new GameStats({
                        win:14
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
                MatchReport.createWithMatchStarted(helper.events.matchStarted),
                createPlayer(helper.events.playerStats.DATA.STEAM_ID),
                createPlayer(helper.events.playerStats.DATA.STEAM_ID),
                createGlobalStats()
            ]).then(function (results) {
                _player = results[1][2];
                _globalStats = results[3][2];
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


    it('should be able to create a game stats document', function () {

        GameStats.createWithMatchStarted(helper.events.playerStats).then(function (doc) {
            expect(doc.games).to.equal(0);
            expect(doc.playtime).to.equal(2229);
        });

    });

    it('should be to create player match stats with a player stats and a game-stats document', function (done) {

        PlayerMatchStats.findOrCreateWithPlayerStats(helper.events.playerStats)
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

    // we are here, we need to solve how to create and update GameStats object.
    // todo, populate _playerMatchStats
    it('should be able to update player overall stats and game type stats with player match stats', function (done) {

        var source = _playerMatchStats.game_stats,
            targets = [_player.game_stats.overall, _player.game_stats[_playerMatchStats.game_type]],
            query = {
                _id: {
                    $in: targets.map(function (t) {
                        return t._id;
                    })
                }
            };

        GameStats.updateWith(source, targets)
            .then(function () {
                GameStats.find(query)
                    .then(function (results) {
                        expect(results[0].win).to.equal(1338);
                        expect(results[1].win).to.equal(16);
                        done();
                    });
            });

    });

    it('should be able to update global overall stats and game type stats with player match stats', function (done) {

        var source = _playerMatchStats.game_stats,
            targets = [_globalStats.game_stats.overall, _globalStats.game_stats[_playerMatchStats.game_type]],
            query = {
                _id: {
                    $in: targets.map(function (t) {
                        return t._id;
                    })
                }
            };

        GameStats.updateWith(source, targets)
            .then(function () {
                GameStats.find(query)
                    .then(function (results) {
                        expect(results[0].win).to.equal(5);
                        expect(results[1].win).to.equal(15);
                        done();
                    });
            }).reject(helper.toLog)
    });

});
