var Promise = require('bluebird'),
    expect = require('chai').expect,
    helper = require('../helper'),
    MatchReport,
    Player,
    GameStats,
    PlayerMatchStats,
    GlobalStats;

describe('When a match report has been submitted.', function () {


    before(function (done) {

        function setDependencies (db) {
            Player = db.model('Player');
            MatchReport = db.model('MatchReport');
            GameStats = db.model('GameStats');
            PlayerMatchStats = db.model('PlayerMatchStats');
            GlobalStats = db.model('GlobalStats');
        }

        function setupScenario () {
            return Promise.all([
                Player.findOrCreateBySteamId('76561198013158463'),
                Player.findOrCreateBySteamId('76561198000636434')
            ]).then(function () {
                return MatchReport.createWithMatchStarted(helper.events.matchStarted)
                    .then(function () {
                        return Promise.all([
                            PlayerMatchStats.createWithPlayerStats(helper.events.playerStats),
                            PlayerMatchStats.createWithPlayerStats(helper.events.playerStats2)
                        ])
                    });
            })
        }

        helper.before()
            .then(setDependencies)
            .then(setupScenario)
            .then(function () {
                done();
            });
    });


    after(helper.after);

    it('should be able to update an existing match report with match report data', function (done) {

        function evaluate () {
            MatchReport.findByMatchGuid(helper.events.matchReport.DATA.MATCH_GUID)
                .then(function (report) {
                    expect(report.tscore0).to.equal(0);
                    expect(report.aborted).to.equal(false);
                    expect(report.last_scorer).to.equal('auraDiiN');
                    expect(report.player_match_stats.length).to.equal(2);
                    done();
                });
        }

        MatchReport.updateWithMatchReport(helper.events.matchReport)
            .then(function (matchReport) {
                return matchReport;
            })
            .then(evaluate);
    });

    it('should be able to update player overall and game type stats', function (done) {

        MatchReport.updateGameStats(helper.events.matchReport.DATA.MATCH_GUID)
            .then(function (r) {
                r.forEach(function (p) {
                    expect(p.ok).to.equal(1);
                    expect(p.n).to.equal(4);
                });
                done();
            });
    });

});