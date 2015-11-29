var Promise = require('bluebird'),
    expect = require('chai').expect,
    helper = require('../helper'),
    MatchReport,
    Player,
    GameStats,
    PlayerMatchStats;

describe('When a match report has been submitted.', function () {


    // assume players have been added
    // assume match report has been created
    // assume player match stats have been created
    // update match report

    before(function (done) {

        function setDependencies (db) {
            Player = db.model('Player');
            MatchReport = db.model('MatchReport');
            GameStats = db.model('GameStats');
            PlayerMatchStats = db.model('PlayerMatchStats');
        }

        var _players,
            _matchReport,
            _playerMatchStats;

        function setupScenario () {
            Promise.try(createPlayers)
                .then(function (results) {
                    _players = [results[0][0], results[1][0]];
                })
                .then(createMatchReport)
                .then(function (results) {
                    _matchReport = results;
                })
                .then(createPlayerMatchStatsForAllPlayers)
                .then(function (results) {
                    _playerMatchStats = [results[0][0], results[1][0]];
                });
        }

        function createPlayers () {
            return Promise.all([
                createPlayer('76561198013158463').then(),
                createPlayer('76561198000636434').then()
            ])
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
                player.save().then(),
                player.game_stats.duel.save().then(),
                player.game_stats.overall.save().then()
            ]);
        }

        function createMatchReport () {
            var matchReport = new MatchReport({
                match_guid: helper.events.matchStarted.DATA.MATCH_GUID,
                game_type: 'duel'
            });


            return matchReport.save();
        }

        function createPlayerMatchStatsForAllPlayers () {
            return Promise.all([
                createPlayerMatchStats(_players[0], _matchReport).then(),
                createPlayerMatchStats(_players[1], _matchReport).then()
            ])
        }

        function createPlayerMatchStats (player, matchReport) {
            var playerMatchStats = new PlayerMatchStats({
                steam_id: player.steam_id,
                match_guid: matchReport.match_guid,
                match: matchReport,
                player: player,
                game_stats: new GameStats(),
                game_type: 'duel'
            });

            return Promise.all([
                playerMatchStats.save().then(),
                playerMatchStats.game_stats.save().then()
            ])
        }

        helper.before()
            .then(setDependencies)
            .then(setupScenario)
            .then(function (results) {
                done();
            });
    });

    after(helper.after);


    describe('When there is no existing match report', function () {

        it('should be able to cancel persistance', function (done) {
            MatchReport.updateWith(helper.events.matchReportNotExisting)
                .catch(function (err) {
                    expect(err).not.to.equal(null);
                    done();
                });
        });

    });

    describe("When there is an existing match report", function () {
        it('should be able to update an existing match report with match report data', function (done) {
            MatchReport.updateWith(helper.events.matchReport)
                .then(function (result) {
                    MatchReport.findByGuid(helper.events.matchReport.DATA.MATCH_GUID).then(function (report) {
                        expect(report.tscore0).to.equal(0);
                        expect(report.aborted).to.equal(false);
                        expect(report.last_scorer).to.equal('auraDiiN');
                        done();
                    });
                });
        });

        it('should be able to associate all player match stats for the match with the match report', function (done) {

            MatchReport.findByGuid(helper.events.matchReport.DATA.MATCH_GUID)
                .then(function (report) {
                    expect(report.player_match_stats.length).to.equal(0);
                    PlayerMatchStats.findByGuid(helper.events.matchReport.DATA.MATCH_GUID)
                        .then(function (playersStats) {
                            report.updateWithPlayersMatchStats(playersStats).then(function (result) {
                                expect(result.player_match_stats.length).to.equal(2);
                                done();
                            });
                        });
                });
        });

    });
});